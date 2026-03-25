"""
stream_c/writer.py

Handles all DB write operations for Stream C:
  - create_session()        — creates an upload_sessions row
  - batch_insert()          — bulk insert validated records into transactions
  - send_to_quarantine()    — batch insert failed records into quarantine
  - update_session_counts() — finalises the session audit row
  - upsert_from_quarantine()— promotes a corrected quarantine record to transactions
"""
from __future__ import annotations

from decimal import Decimal
from typing import Any

from .config import supabase


# ----------------------------------------------------------------
# Session management
# ----------------------------------------------------------------

def create_session(uploaded_by: str, source_filename: str | None = None, notes: str | None = None) -> str:
    """Create an upload session row and return its UUID."""
    payload = {
        "uploaded_by": uploaded_by,
        "total_extracted": 0,
        "total_validated": 0,
        "total_quarantined": 0,
    }
    if source_filename:
        payload["source_filename"] = source_filename
    if notes:
        payload["notes"] = notes

    result = supabase.table("upload_sessions").insert(payload).execute()
    return result.data[0]["id"]


def update_session_counts(
    session_id: str,
    total_extracted: int,
    total_validated: int,
    total_quarantined: int,
) -> None:
    """Finalise the audit counts on an upload session."""
    supabase.table("upload_sessions").update({
        "total_extracted": total_extracted,
        "total_validated": total_validated,
        "total_quarantined": total_quarantined,
    }).eq("id", session_id).execute()


# ----------------------------------------------------------------
# Batch insert validated records → transactions
# ----------------------------------------------------------------

def _to_db_record(augmented: dict, session_id: str) -> dict:
    """Convert an augmented (post-validation) record to a DB-safe dict."""
    tx_date = augmented.get("date")
    due_date = augmented.get("due_date")
    amount = augmented.get("amount")

    return {
        "date": tx_date.isoformat() if tx_date else None,
        "due_date": due_date.isoformat() if due_date else None,
        "amount": float(amount) if isinstance(amount, Decimal) else amount,
        "type": augmented.get("type"),
        "status": augmented.get("status", "pending"),
        "counterparty": augmented.get("counterparty", ""),
        "source": augmented.get("source", ""),
        "description": augmented.get("description"),
        "reference_number": augmented.get("reference_number"),
        "needs_review": augmented.get("needs_review", False),
        "dedup_hash": augmented.get("dedup_hash", ""),
        "raw_ref": augmented.get("raw_ref"),
        "upload_session_id": session_id,
    }


def batch_insert(augmented_records: list[dict], session_id: str) -> list[dict]:
    """
    Bulk-insert all validated records in one DB round-trip.
    Returns the inserted rows.
    """
    if not augmented_records:
        return []

    rows = [_to_db_record(r, session_id) for r in augmented_records]
    result = supabase.table("transactions").insert(rows).execute()
    return result.data


# ----------------------------------------------------------------
# Send failed records → quarantine
# ----------------------------------------------------------------

def send_to_quarantine(
    failed_records: list[tuple[dict, str]],  # (raw_record, reason)
    session_id: str,
) -> list[dict]:
    """
    Batch-insert failed records into the quarantine table.
    Each item is (raw_extracted_data, rejection_reason).
    Returns the inserted quarantine rows.
    """
    if not failed_records:
        return []

    rows = [
        {
            "upload_session_id": session_id,
            "raw_extracted_data": raw,
            "reason": reason,
            "raw_ref": raw.get("raw_ref"),
            "promoted": False,
        }
        for raw, reason in failed_records
    ]
    result = supabase.table("quarantine").insert(rows).execute()
    return result.data


# ----------------------------------------------------------------
# Upsert a corrected quarantine record → promote to transactions
# ----------------------------------------------------------------

def upsert_from_quarantine(
    quarantine_id: str,
    augmented: dict,
    session_id: str,
) -> dict:
    """
    1. Update the quarantine row with the corrected data.
    2. Insert the corrected record into transactions.
    3. Mark quarantine row as promoted.

    Returns the inserted transaction row.
    """
    from decimal import Decimal

    corrected_data = dict(augmented)
    # Serialise dates and Decimals for JSONB storage
    for k, v in corrected_data.items():
        if hasattr(v, "isoformat"):
            corrected_data[k] = v.isoformat()
        elif isinstance(v, Decimal):
            corrected_data[k] = float(v)

    # Insert into transactions first to get the new tx_id
    tx_row = _to_db_record(augmented, session_id)
    tx_result = supabase.table("transactions").insert(tx_row).execute()
    tx_id = tx_result.data[0]["id"]

    # Mark quarantine row as promoted
    supabase.table("quarantine").update({
        "corrected_data": corrected_data,
        "promoted": True,
        "promoted_tx_id": tx_id,
    }).eq("id", quarantine_id).execute()

    return tx_result.data[0]
