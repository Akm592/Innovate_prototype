from flask import Flask, jsonify, request
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

sentiment_analyzer = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    input_text = request.json['text']
    sentiment_result = sentiment_analyzer(input_text)

    sentiment_label = sentiment_result[0]['label']
    sentiment_score = sentiment_result[0]['score']

    response = {
        'label': sentiment_label,
        'score': sentiment_score
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run()
