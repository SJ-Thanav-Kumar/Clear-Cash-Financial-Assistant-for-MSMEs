from sqlalchemy.orm import Session
from models import TransactionModel
from datetime import date

def get_aging_report(db: Session, type_filter: str):
    """
    Buckets pending transactions into 0-30, 31-60, 61-90, and 90+ days.
    """
    today = date.today()
    report = {"0-30": 0, "31-60": 0, "61-90": 0, "90+": 0}

    pending = db.query(TransactionModel).filter(
        TransactionModel.status == "pending",
        TransactionModel.type == type_filter
    ).all()

    for item in pending:
        days_overdue = (today - item.date).days
        if days_overdue <= 30: report["0-30"] += abs(item.amount)
        elif days_overdue <= 60: report["31-60"] += abs(item.amount)
        elif days_overdue <= 90: report["61-90"] += abs(item.amount)
        else: report["90+"] += abs(item.amount)

    return report