import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

/**
 * Creates an instance of the Express application and sets the port to 3000.
 */
const app = express();
const PORT = process.env.PORT || 3000;

// Security: Add Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://unpkg.com"],
      "img-src": ["'self'", "data:", "https://*"],
    },
  },
}));

// Security: Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // use `RateLimit-*` headers; cannot be used with `draft-6`
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/city-info', limiter);

// Enable CORS middleware
app.use(cors());

/**
 * Serves static files from the 'public' directory.
 */
app.use(express.static('public'));

/**
 * Maps WMO weather codes to human-readable descriptions.
 * Reference: https://open-meteo.com/en/docs
 */
function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] || 'Unknown weather condition';
}

/**
 * Retrieves city and weather information from Open-Meteo for a given city name.
 */
export async function getCityInfo(cityName) {
  // Security: Sanitize cityName input
  const sanitizedCityName = cityName.replace(/[<>]/g, '').trim();

  if (!sanitizedCityName) {
    throw new Error('City name is required');
  }

  // Use Open-Meteo Geocoding API to find city coordinates
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(sanitizedCityName)}&count=1&language=en&format=json`;

  try {
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error(`Geocoding service error: ${geoResponse.statusText}`);
    }

    const geoResult = await geoResponse.json();

    if (!geoResult.results || geoResult.results.length === 0) {
      const error = new Error(`City '${sanitizedCityName}' not found`);
      error.status = 404;
      throw error;
    }

    const cityData = geoResult.results[0];

    // Use Open-Meteo Weather API to get current weather, 2 days of hourly forecasts, and 7 days of daily forecasts (including yesterday)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&current=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,is_day&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&past_days=1&forecast_days=7&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(`Weather service error: ${weatherResponse.statusText}`);
    }

    const weatherResult = await weatherResponse.json();
    console.log('Open-Meteo Weather API Response:', weatherResult.current);

    const currentWeather = weatherResult.current || {};
    const weatherDescription = getWeatherDescription(currentWeather.weather_code);

    // Process hourly data to get the next 24 hours starting from the next hour
    const hourlyData = weatherResult.hourly || { time: [], temperature_2m: [], weather_code: [], precipitation_probability: [] };
    const currentTimeLocal = currentWeather.time || new Date().toISOString(); // Open-Meteo returns '2026-02-21T07:45'

    // Find the index of the next hour
    let startIndex = 0;
    for (let i = 0; i < hourlyData.time.length; i++) {
      // Find the first hourly timestamp that is strictly strictly greater than the current local time
      if (hourlyData.time[i] > currentTimeLocal) {
        startIndex = i;
        break;
      }
    }

    const next24Hours = [];
    for (let i = startIndex; i < startIndex + 24 && i < hourlyData.time.length; i++) {
      next24Hours.push({
        time: hourlyData.time[i],
        temperature: hourlyData.temperature_2m[i],
        weatherCode: hourlyData.weather_code[i],
        precipitationProb: hourlyData.precipitation_probability[i] || 0
      });
    }

    // Process daily data
    const dailyData = weatherResult.daily || { time: [], weather_code: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_probability_max: [] };
    const dailyForecast = [];

    for (let i = 0; i < dailyData.time.length; i++) {
      dailyForecast.push({
        date: dailyData.time[i],
        weatherCode: dailyData.weather_code[i],
        maxTemp: dailyData.temperature_2m_max[i],
        minTemp: dailyData.temperature_2m_min[i],
        precipitationProb: dailyData.precipitation_probability_max[i] || 0
      });
    }

    /**
     * Creates an object containing information about the city and its current weather.
     */
    const cityInfo = {
      city: cityData.name || "Not available",
      region: cityData.admin1 || "Not available",
      country: cityData.country || "Not available",
      longitude: cityData.longitude || "Not available",
      latitude: cityData.latitude || "Not available",
      elevation: cityData.elevation !== undefined ? cityData.elevation : "Not available",
      population: cityData.population || "Not available",
      currentTemperature: currentWeather.temperature_2m || "Not available",
      weatherDescription: weatherDescription || "Not available",
      weatherCode: currentWeather.weather_code, // Added for icon/background mapping
      isDay: currentWeather.is_day, // 1 for Day, 0 for Night
      humidity: currentWeather.relative_humidity_2m,
      feelsLike: currentWeather.apparent_temperature,
      widthSpeed: currentWeather.wind_speed_10m,
      pressure: currentWeather.surface_pressure,
      hourlyForecast: next24Hours,
      dailyForecast: dailyForecast
    };
    return cityInfo;

  } catch (error) {
    console.error(`Error fetching info for ${sanitizedCityName}:`, error.message);
    throw error;
  }
}

/**
 * Handles GET requests to the '/city-info' endpoint, which retrieves city and weather information from Open-Meteo.
 */
app.get('/city-info', async (req, res) => {
  const cityName = req.query.cityName;

  if (!cityName) {
    return res.status(400).json({ error: 'cityName parameter is required' });
  }

  try {
    const cityInfo = await getCityInfo(cityName);
    res.json(cityInfo);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Failed to retrieve city information' });
  }
});

// Add a basic route for the root path
app.get('/', (req, res) => {
  res.send('Arnold\'s SkyCast API is running. Use /city-info?cityName=CITY_NAME to get weather information.');
});

// For Vercel serverless deployment, we don't use app.listen()
// Instead, we export the Express app
// However, for local development, we add app.listen()
const __filename = fileURLToPath(import.meta.url);
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (process.env.NODE_ENV !== 'production' && isMain) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
