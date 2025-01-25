from ultralytics import YOLO
import numpy as np
from PIL import Image
import os

class YOLOModel:
    def __init__(self, model_path: str, output_dir: str):
        self.model = YOLO("C://Users//DELL//Downloads//project-bolt-sb1-npypnzts//project//src//api//Models//flatfoot_detection_yolov8.pt")
        self.output_dir = output_dir
        self.labels = {0: "Flat Foot", 1: "Normal"}
        
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)

    def predict(self, image: np.ndarray, filename: str):
        """
        Make predictions using YOLOv8 model and save annotated image
        """
        # Run prediction
        results = self.model.predict(image)
        
        # Save annotated image
        annotated_img_path = os.path.join(self.output_dir, f"annotated_{filename}")
        annotated_img_path = os.path.splitext(annotated_img_path)[0] + ".png"
        image_array = results[0].plot()
        Image.fromarray(image_array).convert("RGB").save(annotated_img_path, format='PNG')
        
        # Process results
        output = []
        if results[0].boxes is not None:
            for box in results[0].boxes.data:
                cls = int(box[5].item())
                conf = float(box[4].item())
                bbox = [float(coord) for coord in box[:4].tolist()]
                
                label = self.labels.get(cls, "Unknown")
                output.append({
                    "label": label,
                    "confidence": conf,
                    "bbox": bbox
                })
        
        return output, os.path.basename(annotated_img_path)