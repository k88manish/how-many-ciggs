
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
  const [locationDenied , setLocationDenied] = useState(false);

  const requestLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setLocationDenied(false);
      return position;
    } catch (err) {
      if (err instanceof GeolocationPositionError && err.code === 1) {
        setLocationDenied(true);
        throw new Error('Location permission denied');
      }
      throw err;
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      // Get user location
      const position = await requestLocation();
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

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes only if location is not denied
    const interval = !locationDenied ? setInterval(fetchData, 5 * 60 * 1000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="max-w-3xl w-full px-6 py-8 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          How many cigarettes are you breathing?
        </h1>
        {error && (
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            {locationDenied && (
              <button
                onClick={() => fetchData()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
              >
                Allow Location Access
              </button>
            )}
          </div>
        )}
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