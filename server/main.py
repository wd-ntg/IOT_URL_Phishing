from flask import Flask, request, jsonify
import joblib
import os
from flask_cors import CORS 

app = Flask(__name__)

CORS(app)
# Đường dẫn tới mô hình và vectorizer
MODEL_PATH = './ai/random_forest_url_model.pkl'
VECTORIZER_PATH = './ai/vectorizer.pkl'

# Tải mô hình và vectorizer
try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("Model and vectorizer loaded successfully.")
except Exception as e:
    print(f"Error loading model or vectorizer: {e}")
    model = None
    vectorizer = None

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Lấy URL từ request
        data = request.get_json()
        url = data.get('url')
        if not url:
            return jsonify({"error": "Missing 'url' parameter."}), 400

        # Chuyển đổi URL thành đặc trưng và dự đoán
        X_new = vectorizer.transform([url])
        prediction = model.predict(X_new)[0]
        result = "phishing" if prediction == 1 else "legitimate"
        print(result)

        return jsonify({"url": url, "prediction": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Server is running."})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
