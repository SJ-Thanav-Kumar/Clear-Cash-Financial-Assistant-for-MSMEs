"""
stream_c/models.py
Pydantic models for request/response validation across Stream C.
"""
from __future__ import annotations
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Optional
from pydantic import BaseModel, field_validator, model_validator
from enum import Enum


class TransactionType(str, Enum):
    payable = "payable"
    receivable = "receivable"
    expense = "expense"
    income = "income"


class TransactionStatus(str, Enum):
    pending = "pending"
    settled = "settled"
    overdue = "overdue"
    needs_review = "needs_review"


# ----------------------------------------------------------------
# Raw record as extracted by Stream A / B (before validation)
# ----------------------------------------------------------------
class RawRecord(BaseModel):
    date: Optional[str] = None           # ISO string, validated later
    due_date: Optional[str] = None
    amount: Optional[Any] = None         # may be string or number — coerced
    type: Optional[str] = None
    status: Optional[str] = None
    counterparty: Optional[str] = None
    source: Optional[str] = None
    description: Optional[str] = None
    reference_number: Optional[str] = None
    raw_ref: Optional[str] = None


# ----------------------------------------------------------------
# Validated record ready to insert into transactions table
# ----------------------------------------------------------------
class ValidatedRecord(BaseModel):
    date: date
    due_date: Optional[date] = None
    amount: Decimal
    type: TransactionType
    status: TransactionStatus = TransactionStatus.pending
    counterparty: str
    source: str
    description: Optional[str] = None
    reference_number: Optional[str] = None
    needs_review: bool = False
    dedup_hash: str = ""
    raw_ref: Optional[str] = None
    upload_session_id: Optional[str] = None


# ----------------------------------------------------------------
# Quarantine record returned from DB
# ----------------------------------------------------------------
class QuarantineRecord(BaseModel):
    id: str
    upload_session_id: Optional[str]
    raw_extracted_data: dict[str, Any]
    corrected_data: Optional[dict[str, Any]]
    reason: str
    raw_ref: Optional[str]
    promoted: bool
    promoted_tx_id: Optional[str]
    created_at: datetime
    updated_at: datetime


# ----------------------------------------------------------------
# Payload for correcting a quarantine record
# ----------------------------------------------------------------
class CorrectionPayload(BaseModel):
    date: Optional[str] = None
    due_date: Optional[str] = None
    amount: Optional[Any] = None
    type: Optional[str] = None
    status: Optional[str] = None
    counterparty: Optional[str] = None
    source: Optional[str] = None
    description: Optional[str] = None
    reference_number: Optional[str] = None


# ----------------------------------------------------------------
# Upload session creation payload
# ----------------------------------------------------------------
class CreateSessionPayload(BaseModel):
    uploaded_by: str
    source_filename: Optional[str] = None
    notes: Optional[str] = None


# ----------------------------------------------------------------
# Batch write payload
# ----------------------------------------------------------------
class BatchWritePayload(BaseModel):
    records: list[RawRecord]
