
import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config'
import cors from 'cors';

/**
 * Creates an instance of the Express application and sets the port to 3000.
 */
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS middleware
app.use(cors());

/**
 * Serves static files from the 'public' directory.
 */
app.use(express.static('public'));


/**
 * Retrieves city and weather information from RapidAPI for a given city name.
 */
async function getCityInfo(cityName) {
  const cityUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=ZA&namePrefix=${encodeURIComponent(cityName)}`;
  
  const cityOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  try {

  /**
   * Makes a request to the RapidAPI GeoDB Cities API using the provided URL and options, and logs the response to the console.
   */
    const cityResponse = await fetch(cityUrl, cityOptions);
    const cityResult = await cityResponse.json();
    console.log('City API Response:', cityResult);

    /**
     * Extracts the city data object from the RapidAPI GeoDB Cities API response.
     */
    const cityData = cityResult.data && cityResult.data.length > 0 ? cityResult.data[0] : {};
   
    const weatherUrl = `https://weatherbit-v1-mashape.p.rapidapi.com/current?lat=${cityData.latitude}&lon=${cityData.longitude}&units=metric&lang=en`;
  
    const weatherOptions = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
      }
    };

    /**
     * Makes a request to the weather API using the provided URL and options, and logs the response to the console.
     */
    const weatherResponse = await fetch(weatherUrl, weatherOptions);
    const weatherResult = await weatherResponse.json();
    console.log('Weather API Response:', weatherResult);

    /**
     * Extracts the current weather data and description from the weather API response.
     */
    const weatherData = weatherResult && weatherResult.data && weatherResult.data.length > 0 ? weatherResult.data[0] : {};
    const weatherDescription = weatherData.weather ? weatherData.weather.description : null;

    /**
     * Creates an object containing information about the city and its current weather.
     */
    const cityInfo = {
      city: cityData.city || "Not available",
      region: cityData.region || "Not available",
      country: cityData.country || "Not available",
      longitude: cityData.longitude || "Not available",
      latitude: cityData.latitude || "Not available",
      population: cityData.population || "Not available",
      currentTemperature: weatherData.temp || "Not available",
      weatherDescription: weatherDescription || "Not available"
    };
    return cityInfo;

  } catch (error) {
    console.log('Error:', error.message);

    throw new Error('Failed to retrieve city information');
  }
}

/**
 * Handles GET requests to the '/city-info' endpoint, which retrieves city and weather information from RapidAPI.
 */
app.get('/city-info', async (req, res) => {
  const cityName = req.query.cityName;

  try {
    const cityInfo = await getCityInfo(cityName);
    res.json(cityInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve city information' });
  }
});

/**
 * Starts the server and listens for incoming requests on the specified port.
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

