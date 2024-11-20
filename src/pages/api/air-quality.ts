import type { APIRoute } from 'astro';

interface AQIResponse {
  status: string;
  data: {
    aqi: number;
    city: {
      name: string;
      geo: [number, number];
    };
  };
}

interface AQIFormattedResponse {
  aqi: number;
  location: string;
  equivalentCigarettes: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

function calculateCigarettes(aqi: number): number {
  return Math.round(aqi / 22);
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: 'Latitude and longitude required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const API_KEY = 'acea9095ba331dd35459f2e202fe0ff0efc567b4';
    const response = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${API_KEY}`);
    const data: AQIResponse = await response.json();

    if (data.status !== 'ok') {
      throw new Error('Failed to fetch AQI data');
    }

    const formattedResponse: AQIFormattedResponse = {
      aqi: data.data.aqi,
      location: data.data.city.name,
      equivalentCigarettes: calculateCigarettes(data.data.aqi),
      coordinates: {
        lat: data.data.city.geo[0],
        lon: data.data.city.geo[1]
      }
    };

    return new Response(JSON.stringify(formattedResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch air quality data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};