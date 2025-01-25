import numpy as np
from PIL import Image
from io import BytesIO

def read_image_as_array(data: bytes) -> np.ndarray:
    """
    Convert image bytes to numpy array
    """
    return np.array(Image.open(BytesIO(data)))