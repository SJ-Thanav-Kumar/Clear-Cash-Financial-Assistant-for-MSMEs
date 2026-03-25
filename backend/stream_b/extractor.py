"""
stream_b/extractor.py

Structured Field Extraction Phase.
Both the Tesseract Regex Path and the LLM JSON path must output the exact same schema.
"""
import re
from typing import Any
import dateutil.parser


def _extract_date(text: str) -> str | None:
    # Look for common date formats in raw text
    # e.g., DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
    match = re.search(r'\b(\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4})\b', text)
    if match:
        try:
            parsed = dateutil.parser.parse(match.group(1), fuzzy=True)
            return parsed.date().isoformat()
        except Exception:
            pass
    return None

def _extract_amount(text: str) -> float | None:
    # Look for "Total", "Amount", "Balance Due" followed by a number
    # This is a basic regex, real implementations use NLP NER models
    lines = text.split('\n')
    for line in lines:
        if re.search(r'(?i)(total|amount|due|sum)', line):
            # Extract number with optional decimals
            match = re.search(r'[\$£€₹]?\s*([0-9,]+(?:\.\d{2})?)', line)
            if match:
                clean_num = match.group(1).replace(',', '')
                try:
                    return float(clean_num)
                except ValueError:
                    continue
    return None

def _extract_vendor(text: str) -> str | None:
    # Usually the first line of the receipt is the vendor
    lines = [line.strip() for line in text.split('\n') if len(line.strip()) > 2]
    if lines:
        return lines[0]  # First non-empty, >2 char line
    return None


def extract_from_tesseract(raw_text: str, avg_conf: float) -> dict[str, Any]:
    """Extract fields using regex on raw Tesseract text."""
    date_str = _extract_date(raw_text)
    amount = _extract_amount(raw_text)
    vendor = _extract_vendor(raw_text)
    
    # Needs review if any critical field is missing, or confidence below 80
    needs_review = bool(not date_str or not amount or not vendor or avg_conf < 80)
    
    return {
        "date": date_str,
        "amount": amount,
        "type": "expense",  # Receipts default to expense
        "status": "settled", # Paid receipt
        "counterparty": vendor,
        "source": "receipt",
        "description": "Auto-extracted via Tesseract OCR",
        "reference_number": None,
        "needs_review": needs_review,
        "confidence_score": avg_conf,
        "extraction_method": "tesseract"
    }


def extract_from_llm(json_data: dict) -> dict[str, Any]:
    """Map the Vision LLM JSON output to the exact Stream A standard schema."""
    
    conf_rating = json_data.get("confidence_rating", "low")
    
    # Map high/medium/low to a proxy numerical score to fit the schema
    conf_map = {"high": 95.0, "medium": 75.0, "low": 45.0}
    num_conf = conf_map.get(conf_rating.lower(), 45.0)
    
    # Needs review if low/medium confidence, or missing mandatory
    date_val = json_data.get("date")
    amt_val = json_data.get("amount")
    vendor_val = json_data.get("counterparty")
    
    needs_review = bool(
        not date_val or 
        not amt_val or 
        not vendor_val or 
        num_conf < 80.0
    )
    
    return {
        "date": date_val,
        "amount": amt_val,
        "type": json_data.get("type") or "expense",
        "status": "settled",
        "counterparty": vendor_val,
        "source": "receipt",
        "description": json_data.get("description"),
        "reference_number": json_data.get("reference_number"),
        "needs_review": needs_review,
        "confidence_score": num_conf,
        "extraction_method": "vision_llm"
    }
