
import { Cigarette } from 'lucide-react';

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
  
  const calculateCigarettes = (aqi: number) => {
    // Ensure aqi is a valid number and not negative
    const validAqi = Math.max(0, Number(aqi) || 0);
    return Math.round(validAqi / 22);
  };
  
  const AQIVisualizer = ({ aqi = 0 }) => {
    const { title, message } = getAQIMessage(aqi);
    const cigaretteCount = calculateCigarettes(aqi);
    
    // Create array of visible cigarettes, capped at 20
    const visibleCigarettes = Array.from(
      { length: Math.min(Math.max(0, cigaretteCount), 20) },
      (_, index) => index
    );
  
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* AQI Message Component */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400">{message}</p>
          <div className="mt-4 text-sm">
            {aqi > 150 && (
              <p className="text-yellow-400">
                Breathing optional today! Just kidding, please wear a mask 😷
              </p>
            )}
          </div>
        </div>
  
        {/* AQI to Cigarettes Visualization */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            Breathing this air is like smoking...
          </h4>
          
          <div className="relative">
            <div className="absolute -top-6 left-0 right-0 text-center">
              <span className="text-4xl font-bold text-red-500">
                {cigaretteCount}
              </span>
              <span className="text-xl text-gray-600 ml-2">
                cigarettes per day
              </span>
            </div>
          </div>
  
          <div className="flex flex-wrap gap-2 justify-center mt-12 mb-4">
            {visibleCigarettes.map((i) => (
              <div
                key={i}
                className={`transform transition-all duration-300 hover:scale-110 ${
                  i % 2 === 0 ? 'rotate-12' : '-rotate-12'
                }`}
              >
                <Cigarette 
                  size={24} 
                  className={`${
                    aqi <= 100 
                      ? 'text-gray-400' 
                      : aqi <= 200 
                      ? 'text-orange-500' 
                      : 'text-red-500'
                  }`}
                />
              </div>
            ))}
          </div>
  
          {cigaretteCount > 20 && (
            <p className="text-center text-gray-500 italic">
              +{cigaretteCount - 20} more cigarettes not shown
            </p>
          )}
  
          {/* Air Quality Scale */}
          <div className="mt-8">
            <div className="h-4 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500">
              <div 
                className="w-4 h-4 rounded-full bg-white border-2 border-gray-800 transform -translate-y-0 transition-all duration-300"
                style={{
                  marginLeft: `${Math.min((Math.max(0, aqi) / 500) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Good</span>
              <span>Moderate</span>
              <span>Hazardous</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AQIVisualizer;