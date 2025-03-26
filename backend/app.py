from flask import Flask, jsonify, request
import requests
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
from flask_cors import CORS
from transformers import pipeline
import os
# Download sentiment lexicon
nltk.download('vader_lexicon')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize SentimentIntensityAnalyzer
sia = SentimentIntensityAnalyzer()

# Load transformer model for sentiment analysis
sentiment_pipeline = pipeline("sentiment-analysis")

def analyze_sentiment(text):
    """Analyzes sentiment of a text and returns positive, neutral, or negative."""
    score = sia.polarity_scores(text)['compound']
    if score >= 0.05:
        return "positive"
    elif score <= -0.05:
        return "negative"
    else:
        return "neutral"

def analyze_sentiment_with_model(text):
    """Analyzes sentiment using Hugging Face transformer model."""
    result = sentiment_pipeline(text)
    sentiment = result[0]['label'].lower()  # 'LABEL_0' -> 'negative', 'LABEL_1' -> 'positive'
    return sentiment

def add_sentiment_emoji(sentiment):
    """Adds an emoji based on the sentiment"""
    if sentiment == "positive":
        return "😃"  # Happy emoji for positive
    elif sentiment == "neutral":
        return "😐"  # Neutral emoji
    else:
        return "😞"  # Sad emoji for negative

@app.route('/horoscope', methods=['GET'])
def get_horoscope():
    """Fetches horoscope, adds sentiment analysis, and returns updated data."""
    api_url = "https://api.aistrology.beandev.xyz/latest"  # Replace with your API link
    response = requests.get(api_url)

    if response.status_code == 200:
        horoscope_data = response.json()

        # Loop through and add sentiment to each horoscope description
        for item in horoscope_data:
            sentiment = analyze_sentiment_with_model(item['description'])
            item['sentiment'] = sentiment
            item['sentiment_emoji'] = add_sentiment_emoji(sentiment)  # Add emoji

        return jsonify(horoscope_data, ensure_ascii=False)

    return jsonify({"error": "Failed to load horoscope"}), 500

@app.route('/feedback', methods=['POST'])
def store_feedback():
    """Store user feedback on sentiment accuracy."""
    feedback = request.get_json()  # Get the feedback data from the request
    # Save the feedback (e.g., to a database, file, or log)
    print(feedback)

    return jsonify({"message": "Feedback received successfully!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
