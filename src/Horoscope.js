import React, { useState } from "react";
import axios from "axios";

const Horoscope = () => {
    const [sign, setSign] = useState("aries");
    const [horoscope, setHoroscope] = useState(null);
    const [error, setError] = useState("");

    const fetchHoroscope = async () => {
        try {
            const response = await axios.get(`/api/horoscope?sign=${sign}`);
            // Access the first item of the array and update the state with it
            const data = response.data[0]; // Since it's an array with one object
            setHoroscope(data);
            setError("");
        } catch (err) {
            setError("Failed to load horoscope.");
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Daily Horoscope</h1>
            <select onChange={(e) => setSign(e.target.value)} value={sign}>
                {["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"].map((zodiac) => (
                    <option key={zodiac} value={zodiac}>{zodiac}</option>
                ))}
            </select>
            <button onClick={fetchHoroscope}>Get Horoscope</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {horoscope && (
                <div>
                    <h2>{horoscope.sign} Horoscope for {horoscope.current_date}</h2>
                    <p><strong>Date Range:</strong> {horoscope.date_range}</p>
                    <p><strong>Mood:</strong> {horoscope.mood}</p>
                    <p><strong>Compatibility:</strong> {horoscope.compatibility}</p>
                    <p><strong>Lucky Number:</strong> {horoscope.lucky_number}</p>
                    <p><strong>Lucky Time:</strong> {horoscope.lucky_time}</p>
                    <p><strong>Description:</strong> {horoscope.description}</p>
                </div>
            )}
        </div>
    );
};

export default Horoscope;
