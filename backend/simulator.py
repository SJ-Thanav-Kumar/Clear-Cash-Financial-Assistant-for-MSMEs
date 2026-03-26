from sqlalchemy.orm import Session
from models import TransactionModel
from liquidity_engine import calculate_liquidity_metrics

def simulate_payment_impact(db: Session, transaction_ids: list[str]):
    """
    Predicts the new 'Days Cash on Hand' if specific bills are paid today.
    """
    metrics = calculate_liquidity_metrics(db)
    current_balance = metrics["current_balance"]
    avg_burn = metrics["avg_daily_outflow"]

    # Calculate total cost of selected items
    to_pay = db.query(TransactionModel).filter(
        TransactionModel.transaction_id.in_(transaction_ids)
    ).all()
    
    total_impact = sum([abs(item.amount) for item in to_pay])
    new_balance = current_balance - total_impact

    # Calculate new runway
    new_runway = new_balance / avg_burn if avg_burn > 0 else 999

    return {
        "original_runway": metrics["days_to_zero"],
        "new_runway": int(new_runway),
        "impact_cost": round(total_impact, 2),
        "warning": "Runway critically short after payment!" if new_runway < 7 else "Safe to proceed"
    }