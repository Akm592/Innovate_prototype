import joblib
import json
from sklearn.preprocessing import LabelEncoder
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load('ml_model/export_model.bin')

with open('path/to/your/config.json', 'r') as config_file:
    config = json.load(config_file)

label_encoder_product = LabelEncoder()
label_encoder_product.classes_ = config['label_encoders']['product']

label_encoder_month = LabelEncoder()
label_encoder_month.classes_ = config['label_encoders']['month']

@app.route('/api/model-output', methods=['POST'])
def predict():
    # Get the request data
    request_data = request.get_json()

    # Preprocess the input data
    product_code = label_encoder_product.transform([request_data['product']])
    month_code = label_encoder_month.transform([request_data['month']])
    input_data = [[product_code[0], month_code[0]]]

    # Make predictions using the loaded model
    prediction = model.predict(input_data)

    # Return the prediction as a response
    response = {'prediction': prediction[0]}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)