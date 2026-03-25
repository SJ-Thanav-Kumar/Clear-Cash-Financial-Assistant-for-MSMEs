"""
stream_b/ocr_runner.py

Runs the preprocessed image through Tesseract OCR using PSM 6 (uniform block of text).
Extracts the raw text and calculates the average word confidence.
"""
import cv2
import numpy as np
import pytesseract
from PIL import Image

def run_tesseract(cv_img: np.ndarray) -> tuple[str, float]:
    """
    Runs Tesseract OCR on a preprocessed BGR/Grayscale OpenCV image.
    Uses PSM 6 (Assume a single uniform block of text) which is best for receipts.
    
    Returns:
        text: The full extracted string.
        avg_conf: The average confidence score (0-100) of all recognized words.
    """
    # Convert OpenCV BGR to RGB for Tesseract/PIL
    if len(cv_img.shape) == 3:
        rgb = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
    else:
        rgb = cv2.cvtColor(cv_img, cv2.COLOR_GRAY2RGB)
        
    pil_img = Image.fromarray(rgb)
    
    # 1. Get raw string
    # --oem 3 is default (LSTM), --psm 6 is single block of text
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(pil_img, config=custom_config)
    
    # 2. Get Data dictionary to calculate average confidence
    data = pytesseract.image_to_data(pil_img, config=custom_config, output_type=pytesseract.Output.DICT)
    
    confidences = []
    # Data['conf'] contains confidence scores. -1 means no word was recognized in that bounding box.
    for i, conf in enumerate(data['conf']):
        # Only count valid words (ignore empty spaces/blocks identified by tesseract)
        if str(conf) != '-1':
            word = data['text'][i].strip()
            if word:  # only score actual words
                confidences.append(float(conf))
                
    if not confidences:
        return text.strip(), 0.0
        
    avg_conf = sum(confidences) / len(confidences)
    return text.strip(), round(avg_conf, 2)
