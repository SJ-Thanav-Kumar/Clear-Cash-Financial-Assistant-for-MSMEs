import pdfplumber
from bank_parsers import parse_hdfc_statement, parse_generic_statement

# The Registry: Maps a bank identifier to its parsing strategy
BANK_PARSERS = {
    "HDFC":    parse_hdfc_statement,
    "GENERIC": parse_generic_statement,
}

def identify_bank_from_pdf(file_path: str) -> str:
    """
    Reads the first page of the PDF and looks for known bank keywords.
    Falls back to the generic parser for any unrecognised statement.
    """
    try:
        with pdfplumber.open(file_path) as pdf:
            first_page_text = pdf.pages[0].extract_text() or ""
    except Exception:
        return "GENERIC"

    text_upper = first_page_text.upper()

    if "HDFC" in text_upper:
        return "HDFC"
    if "ICICI" in text_upper:
        return "GENERIC"   # no dedicated parser yet — fallback
    if "STATE BANK" in text_upper or "SBI" in text_upper:
        return "GENERIC"

    # Unknown bank → use the generic regex-based parser
    return "GENERIC"