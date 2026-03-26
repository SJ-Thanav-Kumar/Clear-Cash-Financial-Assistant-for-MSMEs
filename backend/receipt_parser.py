import pytesseract
import re
from datetime import datetime
from image_pipeline import preprocess_image
from schema import NormalizedTransaction

# Tell pytesseract exactly where the engine is installed
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def parse_receipt_image(image_path: str) -> NormalizedTransaction:
    clean_img = preprocess_image(image_path)
    
    ocr_data = pytesseract.image_to_data(clean_img, config='--psm 6', output_type=pytesseract.Output.DICT)
    
    confidences = [int(c) for c in ocr_data['conf'] if str(c) != '-1']
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0
    
    raw_text = pytesseract.image_to_string(clean_img, config='--psm 6')

    needs_review = True if avg_confidence < 60 else False

    amount_match = re.search(r'(?:TOTAL|AMOUNT)[\s:]*₹?([\d,]+\.\d{2})', raw_text, re.IGNORECASE)
    date_match = re.search(r'(\d{2}[-/]\d{2}[-/]\d{2,4})', raw_text)
    
    amount = float(amount_match.group(1).replace(',', '')) if amount_match else 0.0
    
    parsed_date = None
    if date_match:
        try:
            parsed_date = datetime.strptime(date_match.group(1), "%d/%m/%Y").date()
        except ValueError:
            parsed_date = datetime.today().date()

    return NormalizedTransaction(
        date=parsed_date or datetime.today().date(),
        amount=-abs(amount), 
        type="expense",
        counterparty="Unknown Vendor", 
        status="paid",
        source="receipt",
        raw_ref=raw_text[:200], 
        confidence_score=avg_confidence / 100.0,
        needs_review=needs_review or (amount == 0.0)
    )