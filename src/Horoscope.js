import React, { useState } from "react";
import axios from "axios";
import './styles.css';

const Horoscope = () => {
    const [sign, setSign] = useState("aries");
    const [horoscope, setHoroscope] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchHoroscope = async () => {
        setLoading(true);
        setHoroscope(null);
        setError("");

        try {
            const response = await axios.get("https://web-production-0ba8b.up.railway.app/horoscope");
            console.log("API Response:", response.data);  // Debugging log

            // Filter the correct horoscope based on the selected sign
            const selectedHoroscope = response.data.find(h => h.sign.toLowerCase() === sign.toLowerCase());

            if (selectedHoroscope) {
                setHoroscope(selectedHoroscope);
            } else {
                setError("Horoscope not found for the selected sign.");
            }
        } catch (err) {
            setError("Failed to load horoscope.");
            console.error("API Error:", err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveToFavorites = () => {
        if (horoscope) {
            const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            favorites.push(horoscope);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            alert("Horoscope saved to favorites!");
        }
    };

    return (
        <div className="container">
            <h1>Daily Horoscope</h1>
            <select onChange={(e) => setSign(e.target.value)} value={sign}>
                {["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"].map((zodiac) => (
                    <option key={zodiac} value={zodiac}>{zodiac}</option>
                ))}
            </select>
            <button onClick={fetchHoroscope}>Get Horoscope</button>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {horoscope && (
                <div>
                    <h2>{horoscope.sign} Horoscope for {horoscope.current_date}</h2>
                    <p><strong>Date Range:</strong> {horoscope.date_range}</p>
                    <p><strong>Mood:</strong> {horoscope.mood}</p>
                    <p><strong>Compatibility:</strong> {horoscope.compatibility}</p>
                    <p><strong>Lucky Number:</strong> {horoscope.lucky_number}</p>
                    <p><strong>Sentiment:</strong> {horoscope.sentiment} {horoscope.sentiment_emoji}</p> {/* Display sentiment and emoji */}
                    <p><strong>Lucky Time:</strong> {horoscope.lucky_time}</p>
                    <p><strong>Description:</strong> {horoscope.description}</p>
                    <button onClick={saveToFavorites}>Save to Favorites</button>
                </div>
            )}
        </div>
    );
};

export default Horoscope;
