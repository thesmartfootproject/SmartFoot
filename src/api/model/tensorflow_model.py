import tensorflow as tf
import numpy as np

class TensorFlowModel:
    def __init__(self, model_path: str):
        self.model = tf.keras.models.load_model("C://Users//DELL//Downloads//project-bolt-sb1-npypnzts//project//src//api//Models//hallux_valgus_model12.keras")
        self.class_names = ["Hallux Valgus", "Normal"]
    
    def predict(self, image: np.ndarray):
        """
        Make predictions using TensorFlow model
        """
        # Prepare image
        img_batch = np.expand_dims(image, 0)
        
        # Get predictions
        predictions = self.model.predict(img_batch)
        
        # Process results
        predicted_class = self.class_names[np.argmax(predictions[0])]
        confidence = float(np.max(predictions[0]))
        
        return predicted_class, confidence
    
    

