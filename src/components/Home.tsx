
import React, { useState, useEffect } from 'react';

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="max-w-md w-full px-6 py-8 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg">
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
            {/* <div className="space-y-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{airQuality.location}</p>
                <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
                  <p className="text-4xl font-bold text-yellow-400">
                    {airQuality.equivalentCigarettes}
                  </p>
                  <p className="text-sm mt-2">cigarettes today</p>
                </div>
                <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
                  <p className="text-3xl font-bold text-blue-400">
                    AQI: {airQuality.aqi}
                  </p>
                </div>
              </div>
            </div> */}
            <div className="bg-gray-800 text-white p-6 rounded-lg w-full mt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h2 className="text-xl font-bold">Air Quality Monitor</h2>
                </div>
              </div>
              <p>How many cigarettes are you breathing today?</p>
              <div className="text-6xl font-bold text-center my-4">9</div>
              <p className="text-gray-400">cigarettes today</p>
              <div className="text-2xl font-bold text-blue-400 mt-4">AQI: 203</div>
              <p className="text-gray-400">Moderate, but please hold your breath</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Home;