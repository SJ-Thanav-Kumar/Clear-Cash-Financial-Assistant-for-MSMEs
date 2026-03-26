from sqlalchemy import Column, String, Float, Date, Boolean, JSON
from database import Base

class TransactionModel(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String) # payable, receivable, etc.
    counterparty = Column(String)
    status = Column(String, default="pending") # paid, pending
    source = Column(String) # bank_statement, invoice, receipt
    raw_ref = Column(String)
    needs_review = Column(Boolean, default=False)

class QuarantineModel(Base):
    __tablename__ = "quarantine"

    id = Column(String, primary_key=True)
    reason = Column(String) # e.g., "Missing Date", "Zero Amount"
    raw_data = Column(JSON) # Store the whole messy dictionary here
    created_at = Column(Date)

class UserModel(Base):
    __tablename__ = "users"
    username = Column(String, primary_key=True, index=True)
    password = Column(String)