"""
stream_b/routes.py

FastAPI router for Stream B (Receipt Uploads).
Integrates directly with Stream C (Supabase DB Layer) for validation and writing.
"""
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from typing import Any

from .pipeline import process_receipt_image
from stream_c.validation import validate_record
from stream_c.writer import batch_insert, send_to_quarantine

router = APIRouter(prefix="/api/receipts", tags=["stream_b"])

@router.post("/upload")
async def upload_receipt(
    file: UploadFile = File(...),
    session_id: str | None = Form(None)
):
    """
    1. Receives an uploaded photo of a receipt.
    2. Runs Stream B pipeline (OpenCV -> OCR -> LLM).
    3. Passes result to Stream C validation.
    4. Writes to transactions or quarantine.
    """
    if not session_id:
        raise HTTPException(status_code=400, detail="An upload session_id is required from Stream C.")
        
    image_bytes = await file.read()
    
    # Run the main Stream B processing pipeline
    structured_data, pipeline_error = process_receipt_image(image_bytes)
    
    if pipeline_error:
        # If the pipeline bombed completely (e.g. malformed JSON or unreadable image)
        structured_data["raw_ref"] = file.filename
        
        # Send strictly to quarantine
        quarantine_rows = send_to_quarantine([(structured_data, pipeline_error)], session_id)
        return {
            "status": "quarantined",
            "reason": pipeline_error,
            "quarantine_record_id": quarantine_rows[0]["id"] if quarantine_rows else None
        }

    # Pipeline succeeded in extracting structure! 
    # Now hand off to Stream C's Database Validation Gate
    
    # Needs_review from OCR affects validation logic
    structured_data["raw_ref"] = file.filename
    
    passed, reason, augmented = validate_record(structured_data)
    
    if passed:
        # Write directly to transactions table
        inserted_rows = batch_insert([augmented], session_id)
        return {
            "status": "validated",
            "transaction_record_id": inserted_rows[0]["id"] if inserted_rows else None,
            "data": augmented
        }
    else:
        # Failed Validation Gate (e.g. missing mandatory fields, sign consistency) -> Quarantine
        quarantine_rows = send_to_quarantine([(structured_data, reason)], session_id)
        return {
            "status": "quarantined",
            "reason": reason,
            "quarantine_record_id": quarantine_rows[0]["id"] if quarantine_rows else None,
            "data": structured_data
        }
