from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

ASTROLOGY_API_URL = "https://api.aistrology.beandev.xyz/latest"

@app.route('/horoscope', methods=['GET'])
def get_horoscope():
    sign = request.args.get('sign', 'aries')  # Default to Aries if no sign is provided
    
    # Set up parameters for the API
    params = {
        'sign': sign,
    }
    
    # Make GET request to the new astrology API
    response = requests.get(ASTROLOGY_API_URL, params=params)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch horoscope"}), 500

if __name__ == '__main__':
    app.run(debug=True)
