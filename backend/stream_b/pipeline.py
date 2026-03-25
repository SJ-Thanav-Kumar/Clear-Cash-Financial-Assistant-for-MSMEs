"""
stream_b/pipeline.py

The main orchestration pipeline for Stream B.
1. Standardizes & pre-processes image.
2. Runs Tesseract OCR.
3. If confidence < 60 or QualityCheck failed, falls back to Vision LLM.
4. Extracts structured data into the Stream A format.
"""
from typing import Any

from .image_processor import standardize_image, preprocess_pipeline
from .ocr_runner import run_tesseract
from .vision_llm import run_vision_fallback
from .extractor import extract_from_tesseract, extract_from_llm

CONFIDENCE_THRESHOLD = 60.0

def process_receipt_image(image_bytes: bytes) -> tuple[dict[str, Any], str | None]:
    """
    Process a raw uploaded receipt image byte stream.
    Returns:
        structured_dict: The extracted data in Stream A format.
        error: An error message if it completely failed.
    """
    try:
        # 1. Intake and format standardization -> BGR OpenCV Image
        cv_img = standardize_image(image_bytes)
    except Exception as e:
        return {}, f"Image Standardization Failed: {str(e)}"

    # 2. Preprocess (6 stages) -> Binary OpenCV Image
    binary_img, quality_error = preprocess_pipeline(cv_img)
    
    # 3. Tesseract OCR
    text, avg_conf = run_tesseract(binary_img)
    
    # 4. Routing Decision
    # If the image was overexposed/blank, or Tesseract confidence is too low, use Vision LLM.
    if quality_error or avg_conf < CONFIDENCE_THRESHOLD:
        
        # Pass the original standardized (color) image to the LLM, as B&W throws away details
        # that the LLM might be able to read (like faint colorful stamps).
        llm_json, llm_error = run_vision_fallback(cv_img)
        
        if llm_error or not llm_json:
            # Complete failure of both paths — send to quarantine with minimal data
            return {
                "source": "receipt",
                "needs_review": True,
                "description": "Processing Failed"
            }, f"Vision LLM Fallback Failed: {llm_error or 'Empty Response'}"
            
        # Extract from LLM JSON
        structured_data = extract_from_llm(llm_json)
        
    else:
        # High confidence Tesseract Path
        structured_data = extract_from_tesseract(text, avg_conf)
        
    return structured_data, None
