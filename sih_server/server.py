import pandas as pd
import joblib
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from flask import Flask, request, jsonify, make_response, Response
from io import BytesIO
import matplotlib.pyplot as plt
import base64
from flask_cors import CORS, cross_origin



# Load and preprocess your dataset
data = pd.read_csv('CopyofBook1(1).csv')

# Encode categorical variables
label_encoder_product = LabelEncoder()
data['product'] = label_encoder_product.fit_transform(data['product'])

label_encoder_month = LabelEncoder()
data['month'] = label_encoder_month.fit_transform(data['month'])

# Split the data into features and target
X = data[['product', 'month']]
y = data['export_value']

# Train a machine learning model (Random Forest Regression)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model and label encoders
joblib.dump(model, 'export_model.bin')

config = {
    'model_path': 'export_model.bin',
    'label_encoders': {
        'product': label_encoder_product.classes_.tolist(),
        'month': label_encoder_month.classes_.tolist()
    }
}

with open('config.json', 'w') as config_file:
    json.dump(config, config_file, indent=4)

# Create a Flask app
app = Flask(__name__)
CORS(app, support_credentials=True)

# Create an endpoint to get the predictions
@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    # Load the model and label encoders
    model = joblib.load('export_model.bin')
    with open('config.json', 'r') as config_file:
        config = json.load(config_file)
    label_encoder_product = LabelEncoder()
    label_encoder_product.classes_ = config['label_encoders']['product']
    label_encoder_month = LabelEncoder()
    label_encoder_month.classes_ = config['label_encoders']['month']

    # Preprocess the input data
    data = request.json
    data['product'] = label_encoder_product.transform([data['product']])
    data['month'] = label_encoder_month.transform([data['month']])

    # Make a prediction
    prediction = model.predict(pd.DataFrame(data))

    return jsonify({'prediction': prediction[0]})


# Create an endpoint to get the plot images
@app.route('/plots', methods=['GET'])
def get_plots():
    # Create the plots
    # Plot the export values based on product
    product_groups = data.groupby('product').sum()['export_value']
    plt.bar(product_groups.index, product_groups.values)
    plt.xlabel('Product')
    plt.ylabel('Export Value')
    plt.title('Export Values by Product')
    plt.xticks(range(len(product_groups)), label_encoder_product.inverse_transform(range(len(product_groups))), rotation=90)
    plt.savefig('product_plot.png')
    plt.close()

    # Plot the export values based on month
    month_groups = data.groupby('month').sum()['export_value']
    plt.bar(month_groups.index, month_groups.values)
    plt.xlabel('Month')
    plt.ylabel('Export Value')
    plt.title('Export Values by Month')
    plt.xticks(range(len(month_groups)), label_encoder_month.inverse_transform(range(len(month_groups))), rotation=90)
    plt.savefig('month_plot.png')
    plt.close()

    # Read the plot images as bytes
    with open('product_plot.png', 'rb') as f:
        product_plot_img = f.read()
    with open('month_plot.png', 'rb') as f:
        month_plot_img = f.read()

    # Encode the plot images as base64 strings
    product_plot_base64 = base64.b64encode(product_plot_img).decode('ascii')
    month_plot_base64 = base64.b64encode(month_plot_img).decode('ascii')

    # Create the response
    response_data = {'product_plot': product_plot_base64, 'month_plot': month_plot_base64}
    response = jsonify(response_data)
    response.headers.add('Access-Control-Allow-Origin', '*')  # Allow cross-origin requests for this endpoint

    return response


# Run the Flask app
if __name__ == '__main__':
    app.run()