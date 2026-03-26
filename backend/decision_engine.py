from sqlalchemy.orm import Session
from models import TransactionModel
from liquidity_engine import calculate_liquidity_metrics

def score_obligations(db: Session):
    """
    Ranks all 'pending' payables from 0 to 100.
    100 = Pay IMMEDIATELY (Critical)
    0 = Delay as long as possible.
    """
    metrics = calculate_liquidity_metrics(db)
    current_cash = metrics["current_balance"]
    
    pending_payables = db.query(TransactionModel).filter(
        TransactionModel.status == "pending",
        TransactionModel.amount < 0 # Only look at money going out
    ).all()

    scored_list = []

    for item in pending_payables:
        score = 50 # Base score
        reasons = ["Base Score: 50"]
        
        # 1. Category Weighting
        critical_keywords = ['salary', 'tax', 'rent', 'interest', 'electricity', 'gst']
        if any(word in item.counterparty.lower() or word in (item.raw_ref or "").lower() for word in critical_keywords):
            score += 40
            reasons.append("+40 (Critical Category)")
        
        # 2. Impact Analysis
        # If paying this takes more than 10% of our current cash, penalize the score (conserve cash)
        impact = abs(item.amount) / current_cash if current_cash > 0 else 1
        if impact > 0.10:
            score -= 20
            reasons.append(f"-20 (High Cash Impact: {impact*100:.0f}%)")
        else:
            reasons.append(f"+0 (Low Cash Impact: {impact*100:.0f}%)")

        # 3. Time Pressure (Is it overdue?)
        # (Simplified for this logic)
        
        final_score = max(0, min(100, score))
        scored_list.append({
            "id": item.transaction_id,
            "counterparty": item.counterparty,
            "amount": abs(item.amount),
            "score": final_score,
            "recommendation": "PRIORITY" if final_score > 80 else "STAGGER" if final_score > 40 else "DELAY",
            "reasons": reasons
        })

    # Sort by highest score first
    return sorted(scored_list, key=lambda x: x['score'], reverse=True)