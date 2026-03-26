import pdfplumber
path = r'C:\Users\prana\Downloads\dummy_statement.pdf'
with pdfplumber.open(path) as pdf:
    for i, page in enumerate(pdf.pages):
        print(f'--- PAGE {i+1} ---')
        chars = page.chars
        print(f'  char count: {len(chars)}')
        if chars:
            print(f'  first 5 chars: {[c["text"] for c in chars[:5]]}')
        t1 = page.extract_text(layout=True)
        print(f'  extract_text(layout=True) len: {len(t1) if t1 else 0}')
        if t1:
            print(t1[:800])
        words = page.extract_words()
        print(f'  word count: {len(words)}')
        if words:
            print(f'  first 10 words: {[w["text"] for w in words[:10]]}')
