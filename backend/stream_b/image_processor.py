"""
stream_b/image_processor.py

Intake and standardisation layer + 6-stage OpenCV preprocessing pipeline.

Stages:
1. Intake (Bytes -> PNG, 1500px longest edge)
2. Grayscale
3. Noise Reduction (Median Blur)
4. Deskewing (Hough Lines)
5. Binarization (Otsu's Thresholding)
6. Morphological Dilation (Close gaps)
7. Quality Check (Text density)
"""
import math
import numpy as np
import cv2
from io import BytesIO
from PIL import Image

TARGET_SIZE = 1500
BLANK_THRESHOLD = 0.99  # 99% white -> blank
OVEREXPOSED_THRESHOLD = 0.95  # 95% black -> overexposed


def _resize_to_target(img: Image.Image) -> Image.Image:
    """Scale image so the longest edge is TARGET_SIZE (1500px)."""
    width, height = img.size
    if max(width, height) <= TARGET_SIZE:
        return img  # don't upscale if already smaller
    
    scale = TARGET_SIZE / float(max(width, height))
    new_w = int(width * scale)
    new_h = int(height * scale)
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)


def standardize_image(image_bytes: bytes) -> np.ndarray:
    """
    Intake: Parse bytes, standardize to RGB PNG-like PIL image, resize, 
    and convert to OpenCV ndarray.
    """
    try:
        pil_img = Image.open(BytesIO(image_bytes))
        # Ensure RGB (removes alpha channel, handles CMYK/palette)
        if pil_img.mode != "RGB":
            pil_img = pil_img.convert("RGB")
            
        pil_img = _resize_to_target(pil_img)
        
        # Convert PIL (RGB) to OpenCV (BGR)
        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        
        # Basic check: avoid 1x1 or completely tiny images
        if cv_img.shape[0] < 100 or cv_img.shape[1] < 100:
            raise ValueError("Image is too small to be a document.")
            
        return cv_img
    except Exception as e:
        raise ValueError(f"Failed to decode or standardize image: {str(e)}")


def compute_skew_angle(cv_img: np.ndarray) -> float:
    """Detect dominant angle using Canny edges + Hough lines."""
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    
    # Probabilistic Hough transform
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, minLineLength=100, maxLineGap=10)
    
    if lines is None:
        return 0.0
        
    angles = []
    for line in lines:
        x1, y1, x2, y2 = line[0]
        angle = math.degrees(math.atan2(y2 - y1, x2 - x1))
        # We only care about slight deskewing (e.g., -15 to +15), ignore pure verticals
        if -45 < angle < 45:
            angles.append(angle)
            
    if not angles:
        return 0.0
        
    # use median to avoid outliers
    return float(np.median(angles))


def rotate_image(cv_img: np.ndarray, angle: float) -> np.ndarray:
    """Rotate image by negative angle to deskew it."""
    (h, w) = cv_img.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    
    # White background for rotated areas
    rotated = cv2.warpAffine(
        cv_img, M, (w, h), 
        flags=cv2.INTER_CUBIC, 
        borderMode=cv2.BORDER_CONSTANT, 
        borderValue=(255, 255, 255)
    )
    return rotated


def check_quality(binary_img: np.ndarray) -> str | None:
    """
    Returns an error reason if the image is too blank or too dark, otherwise None.
    binary_img should be a 0 (black) and 255 (white) thresholded image.
    """
    total_pixels = binary_img.shape[0] * binary_img.shape[1]
    
    # In Otsu thresholding, white (255) is usually background, black (0) is text
    white_pixels = cv2.countNonZero(binary_img)
    black_pixels = total_pixels - white_pixels
    
    white_ratio = white_pixels / total_pixels
    black_ratio = black_pixels / total_pixels
    
    if white_ratio > BLANK_THRESHOLD:
        return "Image is blank or heavily overexposed (too white)."
    if black_ratio > OVEREXPOSED_THRESHOLD:
        return "Image is completely dark (too black)."
        
    return None


def preprocess_pipeline(cv_img: np.ndarray) -> tuple[np.ndarray, str | None]:
    """
    Run the 6-stage OpenCV preprocessing pipeline.
    Returns: (processed_binary_image, error_reason)
    """
    try:
        # Stage 1: Deskew (Hough Lines) FIRST so noise/dilation aren't smeared diagonally
        angle = compute_skew_angle(cv_img)
        if abs(angle) > 0.5:
            deskewed = rotate_image(cv_img, angle)
        else:
            deskewed = cv_img
            
        # Stage 2: Grayscale
        gray = cv2.cvtColor(deskewed, cv2.COLOR_BGR2GRAY)
        
        # Stage 3: Noise reduction (Median Blur)
        blurred = cv2.medianBlur(gray, 3)
        
        # Stage 4: Binarization (Otsu's)
        # We invert the threshold (THRESH_BINARY_INV doesn't work well natively with OCR sometimes, 
        # so we do normal binary. White background, black text.)
        _, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Stage 5: Morphological Dilation
        # We want to close gaps in black characters, so if background is white and text is black,
        # we actually need to ERODE the white, which is DILATING the black.
        # However, OpenCV morphological ops are based on White pixels being foreground.
        # So we invert -> dilate (expand white text) -> revert.
        binary_inv = cv2.bitwise_not(binary)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        dilated_inv = cv2.dilate(binary_inv, kernel, iterations=1)
        final_binary = cv2.bitwise_not(dilated_inv)
        
        # Stage 6: Quality check
        quality_error = check_quality(final_binary)
        
        return final_binary, quality_error
        
    except Exception as e:
        return cv_img, f"Preprocessing failed: {str(e)}"
