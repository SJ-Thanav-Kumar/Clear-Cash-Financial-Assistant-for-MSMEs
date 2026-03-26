import pdfplumber
import pypdfium2
import pytesseract
import re
from datetime import datetime, date
from schema import NormalizedTransaction
from typing import List

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# ─── Shared helpers ──────────────────────────────────────────────────────────

def clean_amount(val: str) -> float:
    """Strip currency symbols, commas, spaces → float. Returns 0.0 on failure."""
    if not val or str(val).strip() in ("", "-", "None"):
        return 0.0
    clean_str = re.sub(r'[^\d.]', '', str(val))
    try:
        return float(clean_str)
    except ValueError:
        return 0.0


def _make_transaction(parsed_date, amount: float, description: str) -> NormalizedTransaction:
    tx_type = "income" if amount > 0 else "expense"
    counterparty = str(description).strip()[:200] or "Unknown"
    return NormalizedTransaction(
        date=parsed_date,
        amount=amount,
        type=tx_type,
        counterparty=counterparty,
        status="paid",
        source="bank_statement",
        raw_ref=counterparty,
        confidence_score=0.80,
        needs_review=False,
    )


def _has_text_layer(file_path: str) -> bool:
    """Returns True if the PDF has embedded (selectable) text."""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                if page.chars:
                    return True
    except Exception:
        pass
    return False


def _ocr_pdf_to_lines(file_path: str) -> list:
    """Render each PDF page as image and OCR it; returns all text lines."""
    lines = []
    pdf = pypdfium2.PdfDocument(file_path)
    for page_num in range(len(pdf)):
        page = pdf[page_num]
        # Render at 250 DPI for good OCR accuracy
        bitmap = page.render(scale=250/72)
        img = bitmap.to_pil()
        text = pytesseract.image_to_string(img, config='--psm 6')
        lines.extend(text.splitlines())
    return lines


# ─── Parser A: HDFC-style (table-based, DD/MM/YY) ────────────────────────────

def parse_hdfc_statement(file_path: str) -> List[NormalizedTransaction]:
    raw_rows = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            table = page.extract_table()
            if table:
                raw_rows.extend(table)

    transactions = []
    current_tx = None

    for row in raw_rows:
        if not row or len(row) < 7:
            continue

        date_str, narration, _, _, withdrawal, deposit, _ = [
            str(cell).strip() if cell else "" for cell in row[:7]
        ]

        date_match = re.match(r'^(\d{2}/\d{2}/\d{2,4})', date_str)
        if date_match:
            if current_tx:
                transactions.append(current_tx)

            raw_date = date_match.group(1)
            fmt = "%d/%m/%Y" if len(raw_date) > 8 else "%d/%m/%y"
            try:
                parsed_date = datetime.strptime(raw_date, fmt).date()
            except ValueError:
                continue

            w_amt = clean_amount(withdrawal)
            d_amt = clean_amount(deposit)
            final_amount = d_amt if d_amt > 0 else -w_amt

            current_tx = {
                "date": parsed_date,
                "amount": final_amount,
                "counterparty": narration.replace('\n', ' '),
                "raw_ref": narration,
            }
        elif current_tx and narration:
            current_tx["counterparty"] += " " + narration.replace('\n', ' ')
            current_tx["raw_ref"] += " " + narration.replace('\n', ' ')

    if current_tx:
        transactions.append(current_tx)

    results = []
    for tx in transactions:
        if tx["amount"] == 0:
            continue
        results.append(_make_transaction(tx["date"], tx["amount"], tx["counterparty"]))

    return results


# ─── Parser B: Generic — handles both text-based and image-based PDFs ─────────

# Matches: MM/DD or MM/DD/YY or MM/DD/YYYY at line start
# Then description, then 1-3 dollar amounts
_ROW_RE = re.compile(
    r'^(\d{1,2}/\d{1,2}(?:/\d{2,4})?)'   # date
    r'[\s\t]+'
    r'(.+?)'                               # description (non-greedy)
    r'[\s\t]+'
    r'\$?([\d,]*\.?\d+)'                  # first amount (allows .26)
    r'(?:[\s\t]+\$?([\d,]*\.?\d+))?'      # optional second amount
    r'(?:[\s\t]+\$?([\d,]*\.?\d+))?'      # optional third amount
    r'\s*$',
    re.IGNORECASE,
)

_CREDIT_SECTION_HEADERS = re.compile(
    r'(deposits|credits|preauthorized|interest credit)',
    re.IGNORECASE,
)
_DEBIT_SECTION_HEADERS = re.compile(
    r'(withdrawals|debits|purchase|atm withdrawal)',
    re.IGNORECASE,
)

_CREDIT_KEYWORDS = ['credit', 'deposit', 'interest', 'payroll', 'refund', 'payment received', 'preauthorized']
_DEBIT_KEYWORDS  = ['purchase', 'withdrawal', 'atm', 'fee', 'charge', 'check', 'debit', 'service charge']


def parse_generic_statement(file_path: str) -> List[NormalizedTransaction]:
    """
    Handles any bank statement PDF:
    - If the PDF has a text layer → use pdfplumber text extraction
    - If the PDF is image-based (scanned) → use pypdfium2 + pytesseract OCR
    """
    if _has_text_layer(file_path):
        lines = []
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text(x_tolerance=2, y_tolerance=2) or ""
                lines.extend(text.splitlines())
    else:
        lines = _ocr_pdf_to_lines(file_path)

    return _parse_lines(lines)


def _parse_lines(lines: list) -> List[NormalizedTransaction]:
    transactions = []
    in_credit_section = False
    in_debit_section  = False
    current_year = date.today().year

    for raw_line in lines:
        stripped = raw_line.strip()
        if not stripped:
            continue

        # Track section context
        if _CREDIT_SECTION_HEADERS.search(stripped):
            in_credit_section = True
            in_debit_section  = False
            continue
        if _DEBIT_SECTION_HEADERS.search(stripped):
            in_debit_section  = True
            in_credit_section = False
            continue

        m = _ROW_RE.match(stripped)
        if not m:
            continue

        date_raw     = m.group(1).strip()
        description  = m.group(2).strip()
        amt1_str     = m.group(3)
        amt2_str     = m.group(4)
        amt3_str     = m.group(5)

        # ── Parse date ───────────────────────────────────────────────────
        parts = date_raw.split('/')
        try:
            if len(parts) == 2:
                month, day = int(parts[0]), int(parts[1])
                if month > 12:
                    month, day = day, month  # swap if looks like DD/MM
                parsed_date = date(current_year, month, day)
            else:
                for fmt in ("%m/%d/%Y", "%m/%d/%y", "%d/%m/%Y", "%d/%m/%y"):
                    try:
                        parsed_date = datetime.strptime(date_raw, fmt).date()
                        break
                    except ValueError:
                        continue
                else:
                    continue
        except (ValueError, IndexError):
            continue

        # ── Parse amounts ────────────────────────────────────────────────
        amt1 = clean_amount(amt1_str)
        amt2 = clean_amount(amt2_str) if amt2_str else 0.0
        amt3 = clean_amount(amt3_str) if amt3_str else 0.0

        desc_lower = description.lower()

        if any(k in desc_lower for k in _CREDIT_KEYWORDS):
            # It's a credit — positive
            final_amount = amt1 if amt1 > 0 else amt2
        elif any(k in desc_lower for k in _DEBIT_KEYWORDS):
            # It's a debit — negative
            final_amount = -(amt1 if amt1 > 0 else amt2)
        elif in_credit_section:
            final_amount = amt1
        elif in_debit_section:
            final_amount = -amt1
        else:
            # No context: if two amounts present, likely (transaction, balance)
            # Use the smaller one as the transaction amount
            if amt2 > 0:
                final_amount = -amt1  # assume debit if ambiguous
            else:
                final_amount = -amt1

        if final_amount == 0:
            continue

        transactions.append(_make_transaction(parsed_date, final_amount, description))

    return transactions