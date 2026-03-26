import pdfplumber
import re
from datetime import datetime
from schema import NormalizedTransaction

def parse_invoice_pdf(file_path: str) -> NormalizedTransaction:
    extracted_text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            extracted_text += page.extract_text() + "\n"

    # 1. Regex Extraction (Naive examples, needs robust expansion)
    amount_match = re.search(r'(?:Total|Amount Due)[\s:]*₹?([\d,]+\.?\d*)', extracted_text, re.IGNORECASE)
    date_match = re.search(r'(?:Date|Issue Date)[\s:]*(\d{2}[-/]\d{2}[-/]\d{4})', extracted_text, re.IGNORECASE)
    
    # Fallbacks if regex fails
    amount = float(amount_match.group(1).replace(',', '')) if amount_match else 0.0
    
    parsed_date = None
    if date_match:
        # Assuming DD/MM/YYYY for Indian context
        parsed_date = datetime.strptime(date_match.group(1), "%d/%m/%Y").date()

    # 2. Map to Normalized Schema
    return NormalizedTransaction(
        date=parsed_date or datetime.today().date(),
        amount=-abs(amount), # Payables are negative outflows
        type="payable",
        counterparty="Extracted Vendor Name", # Requires deeper NLP/Regex
        status="pending",
        source="invoice",
        raw_ref=extracted_text[:200], # Keep a snippet for quarantine review
        confidence_score=0.8 if amount and parsed_date else 0.4,
        needs_review=True if not (amount and parsed_date) else False
    )