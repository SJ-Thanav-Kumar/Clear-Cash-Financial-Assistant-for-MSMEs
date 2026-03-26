from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import date
import uuid

class NormalizedTransaction(BaseModel):
    # 1. REQUIRED FIELDS (No defaults) - Must go first
    date: date
    amount: float
    type: Literal["payable", "receivable", "expense", "income"]
    counterparty: str
    status: Literal["paid", "pending", "overdue"]
    source: Literal["bank_statement", "invoice", "receipt", "manual"]
    raw_ref: str
    
    # 2. OPTIONAL / DEFAULT FIELDS - Must go last
    transaction_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    due_date: Optional[date] = None
    flexibility: Literal["fixed", "negotiable", "discretionary"] = "fixed"
    penalty_rate: Optional[float] = None
    
    # Extra fields for Stream tracking
    confidence_score: float = Field(default=1.0, ge=0.0, le=1.0)
    needs_review: bool = False