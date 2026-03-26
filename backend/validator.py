from datetime import date
from schema import NormalizedTransaction

def validate_record(record: NormalizedTransaction):
    """Returns (is_valid, reason)"""
    
    # Check 1: Amount Plausibility
    if record.amount == 0:
        return False, "Amount cannot be zero"
        
    # Check 2: Date Sanity (Not too far in the past or future)
    today = date.today()
    if record.date.year < 2015 or record.date.year > today.year + 2:
        return False, f"Invalid date: {record.date}"
        
    # Check 3: Mandatory Field Presence
    if not record.counterparty or record.counterparty == "Unknown Vendor":
        return False, "Missing or generic counterparty"

    return True, "Valid"