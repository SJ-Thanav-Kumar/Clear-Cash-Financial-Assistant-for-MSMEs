"""
Run this script to see exactly what pdfplumber extracts from any PDF in temp_uploads.
Usage: .\venv\Scripts\python.exe debug_pdf.py <path_to_pdf>
"""
import sys
import pdfplumber
import re

path = sys.argv[1] if len(sys.argv) > 1 else None
if not path:
    # Auto-find first pdf in temp_uploads
    import os
    uploads = "temp_uploads"
    pdfs = [f for f in os.listdir(uploads) if f.endswith(".pdf")]
    if not pdfs:
        print("No PDF found. Pass path as argument or place PDF in temp_uploads/")
        sys.exit(1)
    path = os.path.join(uploads, pdfs[0])

print(f"=== Reading: {path} ===\n")
with pdfplumber.open(path) as pdf:
    for i, page in enumerate(pdf.pages):
        print(f"\n--- PAGE {i+1} (extract_text) ---")
        text = page.extract_text(x_tolerance=2, y_tolerance=2) or ""
        for j, line in enumerate(text.splitlines()):
            print(f"  L{j+1:03d}: {repr(line)}")
        
        print(f"\n--- PAGE {i+1} (extract_table) ---")
        table = page.extract_table()
        if table:
            for row in table:
                print(f"  ROW: {row}")
        else:
            print("  (no table found)")
