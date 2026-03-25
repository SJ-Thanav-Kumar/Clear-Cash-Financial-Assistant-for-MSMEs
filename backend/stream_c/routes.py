"""
stream_c/routes.py

FastAPI router exposing all Stream C endpoints.

Endpoints:
  POST   /api/sessions                      — create upload session
  POST   /api/sessions/{id}/write           — validate + write batch of raw records
  GET    /api/sessions/{id}/records         — all validated records for session (for Stream D)
  GET    /api/sessions/{id}/quarantine      — all quarantine records for session
  PATCH  /api/quarantine/{id}/correct       — submit correction, re-validate, promote
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from .config import supabase
from .models import BatchWritePayload, CorrectionPayload, CreateSessionPayload
from .validation import validate_record
from .writer import (
    batch_insert,
    create_session,
    send_to_quarantine,
    update_session_counts,
    upsert_from_quarantine,
)

router = APIRouter(prefix="/api", tags=["stream_c"])


# ----------------------------------------------------------------
# POST /api/sessions — create a new upload session
# ----------------------------------------------------------------
@router.post("/sessions", status_code=201)
async def create_upload_session(payload: CreateSessionPayload):
    """Create a new upload session and return its ID."""
    session_id = create_session(
        uploaded_by=payload.uploaded_by,
        source_filename=payload.source_filename,
        notes=payload.notes,
    )
    return {"session_id": session_id}


# ----------------------------------------------------------------
# POST /api/sessions/{session_id}/write — validate + persist a batch
# ----------------------------------------------------------------
@router.post("/sessions/{session_id}/write")
async def write_records(session_id: str, payload: BatchWritePayload):
    """
    Run the 5-check validation gate on every record in the batch.
    Valid records go to transactions; failures go to quarantine.
    Returns a summary with session stats.
    """
    # Verify session exists
    session_check = (
        supabase.table("upload_sessions")
        .select("id")
        .eq("id", session_id)
        .limit(1)
        .execute()
    )
    if not session_check.data:
        raise HTTPException(status_code=404, detail="Upload session not found")

    validated = []
    failed: list[tuple[dict, str]] = []
    probable_duplicates: list[dict] = []

    for raw_record in payload.records:
        raw_dict = raw_record.model_dump()
        passed, reason, augmented = validate_record(raw_dict)

        if passed:
            validated.append(augmented)
        elif augmented.get("probable_duplicate"):
            # Route to Stream D queue — not written yet
            probable_duplicates.append({"record": raw_dict, "reason": reason})
        else:
            failed.append((raw_dict, reason))

    # Batch insert validated records
    inserted_txs = batch_insert(validated, session_id)

    # Send failures to quarantine
    quarantine_rows = send_to_quarantine(failed, session_id)

    total = len(payload.records)
    # Update session audit counts
    update_session_counts(
        session_id,
        total_extracted=total,
        total_validated=len(validated),
        total_quarantined=len(failed),
    )

    return {
        "session_id": session_id,
        "total_received": total,
        "validated": len(validated),
        "quarantined": len(failed),
        "probable_duplicates": len(probable_duplicates),
        "inserted_transactions": [r["id"] for r in inserted_txs],
        "quarantine_ids": [r["id"] for r in quarantine_rows],
        "duplicate_records": probable_duplicates,
    }


# ----------------------------------------------------------------
# GET /api/sessions/{session_id}/records — all validated records (for Stream D)
# ----------------------------------------------------------------
@router.get("/sessions/{session_id}/records")
async def get_session_records(session_id: str):
    """Return all validated transactions for a given upload session."""
    result = (
        supabase.table("transactions")
        .select("*")
        .eq("upload_session_id", session_id)
        .order("date")
        .execute()
    )
    return {"session_id": session_id, "records": result.data}


# ----------------------------------------------------------------
# GET /api/sessions/{session_id}/quarantine — quarantine list for a session
# ----------------------------------------------------------------
@router.get("/sessions/{session_id}/quarantine")
async def get_session_quarantine(session_id: str):
    """Return all quarantine records for a given upload session."""
    result = (
        supabase.table("quarantine")
        .select("*")
        .eq("upload_session_id", session_id)
        .order("created_at")
        .execute()
    )
    return {"session_id": session_id, "quarantine": result.data}


# ----------------------------------------------------------------
# PATCH /api/quarantine/{quarantine_id}/correct — submit a correction
# ----------------------------------------------------------------
@router.patch("/quarantine/{quarantine_id}/correct")
async def correct_quarantine_record(quarantine_id: str, correction: CorrectionPayload):
    """
    Accept user-submitted field corrections for a quarantine record.
    Re-runs the full validation gate. If it passes, promotes the record
    to the transactions table. If it fails again, updates the reason.
    """
    # Fetch original quarantine row
    q_result = (
        supabase.table("quarantine")
        .select("*")
        .eq("id", quarantine_id)
        .limit(1)
        .execute()
    )
    if not q_result.data:
        raise HTTPException(status_code=404, detail="Quarantine record not found")

    q_row = q_result.data[0]
    if q_row["promoted"]:
        raise HTTPException(
            status_code=409, detail="Record has already been promoted to transactions"
        )

    session_id = q_row.get("upload_session_id", "")

    # Merge correction over the original raw data
    original = dict(q_row["raw_extracted_data"])
    correction_dict = {k: v for k, v in correction.model_dump().items() if v is not None}
    merged = {**original, **correction_dict}

    # Re-run validation gate (skip duplicate check for corrections)
    passed, reason, augmented = validate_record(merged, skip_duplicate_check=True)

    if passed:
        tx_row = upsert_from_quarantine(quarantine_id, augmented, session_id)
        return {
            "status": "promoted",
            "transaction_id": tx_row["id"],
            "message": "Record passed validation and has been added to transactions.",
        }
    else:
        # Still fails — update reason in quarantine
        supabase.table("quarantine").update({
            "corrected_data": merged,
            "reason": reason,
        }).eq("id", quarantine_id).execute()

        return {
            "status": "still_quarantined",
            "reason": reason,
            "message": "Record failed validation again. Please review the indicated field.",
        }


# ----------------------------------------------------------------
# GET /api/sessions — list all upload sessions (for UI dashboard)
# ----------------------------------------------------------------
@router.get("/sessions")
async def list_sessions():
    """List all upload sessions ordered by most recent first."""
    result = (
        supabase.table("upload_sessions")
        .select("*")
        .order("uploaded_at", desc=True)
        .execute()
    )
    return {"sessions": result.data}
