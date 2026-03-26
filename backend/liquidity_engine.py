from sqlalchemy.orm import Session
from models import TransactionModel
from datetime import date, timedelta
from sqlalchemy import func

def calculate_liquidity_metrics(db: Session):
    """
    Computes the core 'Module 2' financial metrics.
    """
    today = date.today()
    thirty_days_ago = today - timedelta(days=30)

    # 1. Current Cash Balance (Sum of all 'paid' transactions)
    # Note: Inflows are +, Outflows are -
    current_balance = db.query(func.sum(TransactionModel.amount)).filter(
        TransactionModel.status == "paid"
    ).scalar() or 0.0

    # 2. Average Daily Outflow (Burn Rate) over last 30 days
    total_outflow_30d = db.query(func.sum(TransactionModel.amount)).filter(
        TransactionModel.status == "paid",
        TransactionModel.amount < 0,
        TransactionModel.date >= thirty_days_ago
    ).scalar() or 0.0
    
    avg_daily_outflow = abs(total_outflow_30d) / 30

    # 3. Days Cash on Hand (DCOH)
    days_to_zero = current_balance / avg_daily_outflow if avg_daily_outflow > 0 else 999

    return {
        "current_balance": round(current_balance, 2),
        "avg_daily_outflow": round(avg_daily_outflow, 2),
        "days_to_zero": int(days_to_zero),
        "status": "CRITICAL" if days_to_zero < 7 else "WARNING" if days_to_zero < 14 else "HEALTHY"
    }

def get_cash_flow_projection(db: Session, days: int = 30):
    """
    Generates a day-by-day balance curve.
    Formula: projected_balance(t) = current_balance + sum(inflows) - sum(outflows)
    """
    today = date.today()
    metrics = calculate_liquidity_metrics(db)
    current_balance = metrics["current_balance"]
    
    projection = []
    running_balance = current_balance

    # Fetch all pending obligations (Payables/Receivables)
    pending_items = db.query(TransactionModel).filter(
        TransactionModel.status == "pending"
    ).order_by(TransactionModel.date).all()

    for i in range(days):
        target_date = today + timedelta(days=i)
        
        # Find transactions due on this specific day
        daily_movement = sum([item.amount for item in pending_items if item.date == target_date])
        running_balance += daily_movement
        
        projection.append({
            "date": target_date.isoformat(),
            "projected_balance": round(running_balance, 2)
        })

    return projection