import cv2
import numpy as np

def preprocess_image(image_path: str) -> np.ndarray:
    """The OpenCV preprocessing pipeline for messy receipts."""
    
    # Stage 0: Intake and standardization
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image file at {image_path}")
        
    # Standardize size (resize longest edge to 1500px for better OCR)
    h, w = img.shape[:2]
    scale = 1500 / max(h, w)
    img = cv2.resize(img, (int(w * scale), int(h * scale)))

    # Stage 1: Grayscale conversion
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Stage 2: Noise reduction (Median Blur)
    blurred = cv2.medianBlur(gray, 3)

    # Stage 3 & 4: Binarization (Otsu's Thresholding)
    # This automatically finds the best cutoff between text and background shadows
    _, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Stage 5: Morphological Dilation
    # Closes tiny gaps in broken letters printed by cheap thermal receipt printers
    kernel = np.ones((2, 2), np.uint8)
    processed_img = cv2.dilate(binary, kernel, iterations=1)

    # Stage 6: Density Check
    total_pixels = processed_img.size
    black_pixels = total_pixels - cv2.countNonZero(processed_img)
    density = black_pixels / total_pixels
    
    if density < 0.01 or density > 0.90:
        raise ValueError("Image text density out of bounds. Likely a blank photo or thumb covering the lens.")

    return processed_img