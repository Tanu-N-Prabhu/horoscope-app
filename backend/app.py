import os
from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

ASTROLOGY_API_URL = "https://api.aistrology.beandev.xyz/latest"

@app.route('/horoscope', methods=['GET'])
def get_horoscope():
    sign = request.args.get('sign', 'aries')  # Default to Aries if no sign is provided
    
    response = requests.get(ASTROLOGY_API_URL, params={"sign": sign})
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch horoscope"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Ensure Flask binds to the correct port
    app.run(host='0.0.0.0', port=port)
