from sqlalchemy.orm import Session
from models import TransactionModel
from rapidfuzz import fuzz
from datetime import timedelta

def run_deduplication(db: Session, new_record: TransactionModel):
    """
    Checks if the new_record is a duplicate of something already in the DB.
    Matches on: Amount (Exact) AND Date (+/- 3 days) AND Counterparty (Fuzzy).
    """
    # 1. Look for potential matches in a 3-day window
    start_date = new_record.date - timedelta(days=3)
    end_date = new_record.date + timedelta(days=3)

    potential_matches = db.query(TransactionModel).filter(
        TransactionModel.amount == new_record.amount,
        TransactionModel.date >= start_date,
        TransactionModel.date <= end_date,
        TransactionModel.transaction_id != new_record.transaction_id
    ).all()

    for match in potential_matches:
        # 2. Compare names using Fuzzy logic (0-100 score)
        similarity = fuzz.token_sort_ratio(new_record.counterparty, match.counterparty)
        
        if similarity > 80:
            # Found a duplicate! 
            # If one is an 'invoice' and one is 'bank_statement', reconcile them.
            if new_record.source != match.source:
                match.status = "reconciled"
                new_record.status = "reconciled"
                return True, match.transaction_id

    return False, None