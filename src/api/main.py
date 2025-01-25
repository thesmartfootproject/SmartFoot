from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import os
import numpy as np
import tensorflow as tf
from io import BytesIO
import uvicorn
from tensorflow.keras.models import load_model
# Initialize FastAPI app
app = FastAPI()

# Enable CORS for local development
origins = [
    "http://localhost",
    "http://localhost:3000",
     "http://localhost:5173",  # Added Vite's default port
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to save annotated images
OUTPUT_DIR = "annotated_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load YOLO model
yolo_model = YOLO(r'Models\flatfoot_detection_yolov8.pt')

# Load TensorFlow model
tensorflow_model = tf.keras.models.load_model(r'Models\hallux_valgus_model12.keras')


# Custom labels for YOLO
CUSTOM_LABELS = {0: "Flat Foot", 1: "Normal"}
CLASS_NAMES = ["Hallux Valgus", "Normal"]

@app.get("/ping")
async def ping():
    """
    Health check endpoint.
    """
    return {"message": "API is alive!"}

def read_file_as_image(data: bytes) -> np.ndarray:
    """
    Convert uploaded image file bytes to NumPy array.
    """
    image = np.array(Image.open(BytesIO(data)))
    return image

# YOLOv8 prediction endpoint
@app.post("/predict/yolo")
async def predict_yolo(file: UploadFile = File(...)):
    """
    Predict endpoint for YOLOv8 object detection.
    - Saves the annotated image.
    - Returns predictions and the URL of the annotated image.
    """
    # Read the uploaded image
    image = read_file_as_image(await file.read())

    # Run YOLOv8 model prediction
    results = yolo_model.predict(image)

    # Save annotated image with a specific format (PNG)
    annotated_img_path = os.path.join(OUTPUT_DIR, f"annotated_{file.filename}")
    annotated_img_path = annotated_img_path.split('.')[0] + ".png"  # Ensure PNG format
    image_array = results[0].plot()
    
    # Save the annotated image
    Image.fromarray(image_array).convert("RGB").save(annotated_img_path, format='PNG')

    # Extract predictions
    output = []
    if results[0].boxes is not None:  # Handle cases with detections
        for box in results[0].boxes.data:
            cls = int(box[5].item())  # Class index (assumes index 5 is class)
            conf = float(box[4].item())  # Confidence score (assumes index 4 is confidence)
            bbox = [float(coord) for coord in box[:4].tolist()]  # Bounding box coordinates (assumes first 4 are xyxy)

            label = CUSTOM_LABELS.get(cls, "Unknown")
        
            output.append({
                "label": label,
                "confidence": conf,
                "bbox": bbox
            })

    return JSONResponse({
        "predictions": output,
        "annotated_image_url": f"http://localhost:8000/annotated_images/{os.path.basename(annotated_img_path)}"
    })

# TensorFlow prediction endpoint
@app.post("/predict/tensorflow")
async def predict_tensorflow(file: UploadFile = File(...)):
    """
    Predict endpoint for TensorFlow model prediction.
    """
    # Read the uploaded image
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    predictions = tensorflow_model.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

@app.get("/annotated_images/{image_path:path}")
async def serve_image(image_path: str):
    """
    Endpoint to serve annotated images.
    """
    full_path = os.path.join(OUTPUT_DIR, image_path)
    
    # Check if the image exists
    if os.path.exists(full_path):
        return FileResponse(full_path)
    
    return JSONResponse({"error": "Image not found"}, status_code=404)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)

