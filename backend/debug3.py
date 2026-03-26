import sys
sys.path.insert(0, r'c:\Users\prana\Downloads\demo1\demo1\backend')
from bank_parsers import parse_generic_statement, _has_text_layer, _ocr_pdf_to_lines

path = r'C:\Users\prana\Downloads\dummy_statement.pdf'
print(f'Has text layer: {_has_text_layer(path)}')
print('Running OCR...')
lines = _ocr_pdf_to_lines(path)
print(f'Total lines from OCR: {len(lines)}')
print('\n--- First 60 non-empty lines ---')
count = 0
for l in lines:
    if l.strip():
        print(repr(l))
        count += 1
        if count >= 60:
            break

print('\n--- Running full parser ---')
records = parse_generic_statement(path)
print(f'Parsed {len(records)} transactions:')
for r in records:
    print(f'  {r.date}  {r.counterparty[:40]:<40}  {r.amount:>10.2f}')
