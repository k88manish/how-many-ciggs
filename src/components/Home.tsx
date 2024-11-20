
import React, { useState, useEffect } from 'react';
import AQIVisualizer from './AQIVisualizer';

interface AirQualityData {
  error?: string;
  aqi: number;
  equivalentCigarettes: number;
  location: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

const Home: React.FC = () => {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get user location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude: lat, longitude: lon } = position.coords;

        // Call our API endpoint
        const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
        const data: AirQualityData = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch data');

        setAirQuality(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };


    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getAQIMessage = (aqi: number) => {
    if (aqi <= 50) {
      return {
        title: "Fresh as a Mountain Breeze! 🌄",
        message: "The air is so clean you could bottle it and sell it on eBay!"
      };
    } else if (aqi <= 100) {
      return {
        title: "Still Breathing Easy! 😌",
        message: "Your lungs are doing a happy dance right now."
      };
    } else if (aqi <= 150) {
      return {
        title: "Mildly Spicy Air! 🌶️",
        message: "Time to practice being a mouth breather!"
      };
    } else if (aqi <= 200) {
      return {
        title: "Ninja Mode Activated! 🥷",
        message: "Your mask is your new best friend. Don't leave home without it!"
      };
    } else if (aqi <= 300) {
      return {
        title: "Dragon Breath Territory! 🐲",
        message: "Is this air or soup? Asking for my lungs..."
      };
    } else {
      return {
        title: "Apocalypse Now! 😷",
        message: "Time to become a professional indoor person. Netflix approves!"
      };
    }
  };

  const aqiMessage = airQuality ? getAQIMessage(airQuality.aqi) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="max-w-3xl w-full px-6 py-8 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          How many cigarettes are you breathing?
        </h1>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>{error}</p>
          </div>
        ) : airQuality ? (
          <>
            <AQIVisualizer aqi={airQuality.aqi} />
            <div className="max-w-2xl mx-auto bg-gray-800 text-white p-6 rounded-lg w-full mt-4">
              {/* <div className="text-8xl font-bold text-center my-4">{airQuality.equivalentCigarettes}</div> */}
              {/* <div className="text-2xl font-bold text-blue-400 mt-4">AQI: {airQuality.aqi}</div> */}
              <div className="text-8xl font-bold text-center my-4">AQI: {airQuality.aqi}</div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};




export default Home;