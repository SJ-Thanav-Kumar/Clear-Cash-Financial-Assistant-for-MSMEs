"""
stream_b/vision_llm.py

Fallback for Low-Confidence Tesseract results or pure handwriting.
Uses GPT-4o-mini (or GPT-4o) to extract structured JSON directly from the image.
"""
import os
import io
import cv2
import base64
import json
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

PROMPT_TEXT = """
You are a highly accurate receipt transcription AI.
Extract the following fields from the receipt image.
Return ONLY valid JSON.
No markdown block, no preamble, no explanations.

If a field is illegible or missing, return null.

Required JSON Structure:
{
    "date": "<YYYY-MM-DD or null>",
    "amount": <number or null>,
    "type": "<payable | receivable | expense | income | null>",
    "counterparty": "<vendor name or null>",
    "description": "<brief description of items or null>",
    "reference_number": "<receipt or transaction ID or null>",
    "confidence_rating": "<high | medium | low>"
}

Rules:
- amount: extract the *final total amount* as a raw number (e.g., 25.50), no currency symbols.
- type: For standard merchant/store receipts, default to "expense". 
- counterparty: The name of the store, vendor, or person receiving the money.
"""

def encode_image_base64(cv_img: np.ndarray) -> str:
    """Encode OpenCV image to base64 JPEG for OpenAI API."""
    _, buffer = cv2.imencode('.jpg', cv_img)
    io_buf = io.BytesIO(buffer)
    return base64.b64encode(io_buf.getvalue()).decode('utf-8')


def run_vision_fallback(cv_img: np.ndarray) -> tuple[dict | None, str | None]:
    """
    Submits image to Vision LLM for structured extraction.
    Returns (extracted_json_dict, error_reason)
    """
    if not client.api_key:
        return None, "OpenAI API Key is not configured."
        
    base64_image = encode_image_base64(cv_img)
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Fast, cheap, capable vision model
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": PROMPT_TEXT},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300,
            temperature=0.0
        )
        
        raw_output = response.choices[0].message.content.strip()
        
        # Clean up if model includes markdown code blocks
        if raw_output.startswith("```json"):
            raw_output = raw_output[7:]
        if raw_output.startswith("```"):
            raw_output = raw_output[3:]
        if raw_output.endswith("```"):
            raw_output = raw_output[:-3]
            
        parsed_json = json.loads(raw_output.strip())
        return parsed_json, None
        
    except json.JSONDecodeError:
        return None, "Vision LLM returned malformed JSON."
    except Exception as e:
        return None, f"Vision LLM API Error: {str(e)}"
