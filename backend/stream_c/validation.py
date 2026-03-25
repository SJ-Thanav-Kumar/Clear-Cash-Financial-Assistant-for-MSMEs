"""
stream_c/validation.py

The 5-check validation gate.  Every raw extracted record passes through
validate_record() before it can be written to the transactions table.

Returns a tuple:
    (passed: bool, reason: str | None, augmented_record: dict)

If passed is False the record must go to quarantine.
The augmented_record always contains flags like needs_review even on success.
"""
from __future__ import annotations

import hashlib
from datetime import date, datetime, timedelta
from decimal import Decimal, InvalidOperation
from typing import Any

from .config import supabase

VALID_TYPES = {"payable", "receivable", "expense", "income"}
VALID_SOURCES = {"bank_statement", "receipt", "invoice", "manual"}
DATE_MIN = date(2015, 1, 1)
LARGE_RECEIPT_THRESHOLD = Decimal("5000000")  # ₹50 lakh


# ----------------------------------------------------------------
# Helper: parse a flexible date string → date | None
# ----------------------------------------------------------------
def _parse_date(value: Any) -> date | None:
    if value is None:
        return None
    if isinstance(value, date):
        return value
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%d %b %Y", "%d %B %Y"):
        try:
            return datetime.strptime(str(value).strip(), fmt).date()
        except ValueError:
            continue
    return None


# ----------------------------------------------------------------
# Helper: parse amount to Decimal | None
# ----------------------------------------------------------------
def _parse_amount(value: Any) -> Decimal | None:
    if value is None:
        return None
    try:
        cleaned = str(value).replace(",", "").replace("₹", "").replace("Rs", "").strip()
        return Decimal(cleaned)
    except InvalidOperation:
        return None


# ----------------------------------------------------------------
# Check 1 — Mandatory field presence
# ----------------------------------------------------------------
def _check_mandatory(rec: dict) -> tuple[bool, str | None]:
    mandatory = ["date", "amount", "type", "status", "counterparty", "source"]
    for field in mandatory:
        if rec.get(field) is None or str(rec.get(field, "")).strip() == "":
            return False, f"Mandatory field missing or null: '{field}'"
    return True, None


# ----------------------------------------------------------------
# Check 2 — Sign consistency
# ----------------------------------------------------------------
def _check_sign(tx_type: str, amount: Decimal) -> tuple[bool, str | None]:
    negative_types = {"payable", "expense"}
    positive_types = {"receivable", "income"}

    if tx_type in negative_types and amount >= 0:
        return (
            False,
            f"Sign inconsistency: type='{tx_type}' requires negative amount, got {amount}",
        )
    if tx_type in positive_types and amount <= 0:
        return (
            False,
            f"Sign inconsistency: type='{tx_type}' requires positive amount, got {amount}",
        )
    return True, None


# ----------------------------------------------------------------
# Check 3 — Date sanity
# ----------------------------------------------------------------
def _check_dates(
    tx_date: date, due_date: date | None
) -> tuple[bool, str | None]:
    date_max = date.today() + timedelta(days=730)  # 2 years ahead

    if not (DATE_MIN <= tx_date <= date_max):
        return (
            False,
            f"Date out of range: {tx_date} (expected {DATE_MIN} to {date_max})",
        )
    if due_date is not None and due_date < tx_date:
        return False, f"due_date ({due_date}) is before date ({tx_date})"
    return True, None


# ----------------------------------------------------------------
# Check 4 — Amount plausibility
# ----------------------------------------------------------------
def _check_amount_plausibility(
    amount: Decimal, source: str
) -> tuple[bool, str | None, bool]:
    """Returns (passed, reason, needs_review)"""
    abs_amount = abs(amount)
    if abs_amount == 0:
        return False, "Amount is zero — not a real transaction", False

    needs_review = False
    if source == "receipt" and abs_amount > LARGE_RECEIPT_THRESHOLD:
        # Flag but don't reject — unusual but possible
        needs_review = True

    return True, None, needs_review


# ----------------------------------------------------------------
# Check 5 — Duplicate pre-screening (fast hash lookup)
# ----------------------------------------------------------------
def _compute_hash(counterparty: str, amount: Decimal, tx_date: date) -> str:
    raw = f"{counterparty.strip().lower()}|{abs(amount)}|{tx_date.isoformat()}"
    return hashlib.sha256(raw.encode()).hexdigest()


def _check_duplicate(dedup_hash: str) -> tuple[bool, str | None]:
    """
    Returns (is_probably_duplicate: bool, reason | None).
    True means a matching hash was found — record should be held for Stream D.
    """
    result = (
        supabase.table("transactions")
        .select("id")
        .eq("dedup_hash", dedup_hash)
        .limit(1)
        .execute()
    )
    if result.data:
        return True, f"Probable duplicate detected (hash={dedup_hash[:12]}…)"
    return False, None


# ----------------------------------------------------------------
# Main entry point: validate_record
# ----------------------------------------------------------------
def validate_record(
    raw: dict,
    skip_duplicate_check: bool = False,
) -> tuple[bool, str | None, dict]:
    """
    Run all 5 validation checks against a raw extracted record.

    Returns:
        passed        — True if the record may be inserted
        reason        — Rejection reason if passed=False, else None
        augmented     — The record dict enriched with parsed fields and flags
    """
    augmented = dict(raw)

    # ---- Parse and coerce types before checks ----
    tx_date = _parse_date(raw.get("date"))
    due_date = _parse_date(raw.get("due_date"))
    amount = _parse_amount(raw.get("amount"))
    tx_type = str(raw.get("type", "")).strip().lower()
    source = str(raw.get("source", "")).strip().lower()

    # Overwrite with parsed values
    augmented["date"] = tx_date
    augmented["due_date"] = due_date
    augmented["amount"] = amount
    augmented["type"] = tx_type
    augmented["source"] = source
    augmented["needs_review"] = False
    augmented["dedup_hash"] = ""
    augmented["probable_duplicate"] = False

    # ---- Check 1: Mandatory fields ----
    # Re-validate with coerced values (date/amount may still be None if parsing failed)
    coerced_for_mandatory = dict(augmented)
    coerced_for_mandatory["date"] = tx_date
    coerced_for_mandatory["amount"] = amount
    passed, reason = _check_mandatory(coerced_for_mandatory)
    if not passed:
        return False, reason, augmented

    # ---- Check 2: Sign consistency ----
    if tx_type not in VALID_TYPES:
        return False, f"Invalid transaction type: '{tx_type}'", augmented

    passed, reason = _check_sign(tx_type, amount)
    if not passed:
        return False, reason, augmented

    # ---- Check 3: Date sanity ----
    passed, reason = _check_dates(tx_date, due_date)
    if not passed:
        return False, reason, augmented

    # ---- Check 4: Amount plausibility ----
    passed, reason, needs_review = _check_amount_plausibility(amount, source)
    augmented["needs_review"] = needs_review
    if not passed:
        return False, reason, augmented

    # ---- Compute dedup hash (needed for Check 5 and DB insert) ----
    counterparty = str(raw.get("counterparty", "")).strip()
    dedup_hash = _compute_hash(counterparty, amount, tx_date)
    augmented["dedup_hash"] = dedup_hash

    # ---- Check 5: Duplicate pre-screening ----
    if not skip_duplicate_check:
        is_dup, reason = _check_duplicate(dedup_hash)
        if is_dup:
            augmented["probable_duplicate"] = True
            # Not a hard rejection — flag and let Stream D handle it
            # We return passed=False with reason so the caller can route to Stream D queue
            return False, reason, augmented

    return True, None, augmented
