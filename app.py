import os
import numpy as np
import pickle
import tensorflow as tf
from flask import Flask, request, render_template, jsonify
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Disable OneDNN & Reduce TensorFlow Logging
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

app = Flask(__name__, static_folder="frontend/dist", static_url_path="", template_folder="frontend/dist")

# Load Tokenizer
print("Loading tokenizer...")
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)
print("Tokenizer loaded!")

# Load model (prefer TFLite with fallback to standard Keras H5 if TFLite Flex ops are unsupported)
interpreter = None
keras_model = None
input_details = None
output_details = None

try:
    print("Attempting to load TFLite model...")
    interpreter = tf.lite.Interpreter(model_path="fake_job_lstm_model.tflite")
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    print("TFLite model loaded successfully!")
except Exception as e:
    print(f"TFLite model load failed ({e}). Falling back to standard Keras .h5 model...")
    interpreter = None
    keras_model = tf.keras.models.load_model("fake_job_lstm_model.h5")
    print("Keras model loaded successfully!")

MAX_SEQUENCE_LENGTH = 200

def preprocess_text(text):
    sequence = tokenizer.texts_to_sequences([text])
    return pad_sequences(sequence, maxlen=MAX_SEQUENCE_LENGTH, dtype="float32")

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if request.is_json:
        data = request.get_json()
        combined_text = data.get("combined_text")
    else:
        combined_text = request.form.get("combined_text")

    if not combined_text:
        if request.is_json:
            return jsonify({"status": "error", "message": "Please enter the job description."}), 400
        return render_template("index.html", prediction="Please enter the job description.")

    # Preprocess the input
    input_data = preprocess_text(combined_text)

    # Run inference
    if interpreter is not None:
        interpreter.set_tensor(input_details[0]["index"], input_data)
        interpreter.invoke()
        prediction = interpreter.get_tensor(output_details[0]["index"])[0][0]
    else:
        prediction = keras_model.predict(input_data)[0][0]

    # Determine result
    result = "Fraudulent" if prediction > 0.7 else "Legitimate"

    if request.is_json:
        confidence = float(prediction * 100) if result == "Fraudulent" else float((1 - prediction) * 150 - 50)  # scale confidence dynamically
        # Clamp confidence between 50% and 100% for legitimate
        if result == "Legitimate":
            confidence = max(50.0, min(100.0, float((1 - prediction) * 100)))
        return jsonify({
            "status": "success",
            "prediction": float(prediction),
            "result": result,
            "confidence": confidence
        })

    return render_template("index.html", prediction=f"The job post is {result}")

if __name__ == "__main__":
    app.run(debug=True)



