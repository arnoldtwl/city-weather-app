## City & Weather Information App

This project is a web-based application that fetches and displays data about cities in South Africa and their current weather conditions. The data is retrieved using the Fetch API from two different sources: GeoDB Cities API for city details and Weatherbit API for weather information.

## Live Demo
The application is deployed on Vercel and can be accessed at [https://city-weather-app-one.vercel.app/](https://city-weather-app-one.vercel.app/).

## Technologies Used
- Node.js
- Express.js
- node-fetch
- HTML5
- CSS
- JavaScript
- Vercel (for serverless deployment)

## Features
- Search for any city in South Africa
- View detailed city information (population, coordinates, etc.)
- Get current weather conditions and temperature
- Responsive design for mobile and desktop

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- A RapidAPI key for GeoDB Cities and Weatherbit APIs

### Local Development
1. Clone the repository:
   ```
   git clone https://github.com/arnoldtwl/city-weather-app.git
   cd city-weather-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your RapidAPI key:
   ```
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```

4. Install Vercel CLI (optional, for local testing):
   ```
   npm i -g vercel
   ```

5. Run the development server:
   ```
   vercel dev
   ```
   or
   ```
   node index.js
   ```

6. Open your browser and navigate to http://localhost:3000

## Deployment on Vercel

This project is configured for deployment on Vercel's serverless platform:

1. Push your code to a GitHub repository
2. Import the repository in Vercel dashboard
3. Add your `RAPIDAPI_KEY` as an environment variable
4. Deploy!

## Project Structure
- `/api/index.js`: The server-side JavaScript file that handles API requests (configured for Vercel serverless)
- `/public/index.html`: The HTML file that provides the frontend interface
- `/public/script.js`: The client-side JavaScript for user interactions and API calls
- `/public/style.css`: CSS styling for the frontend
- `/vercel.json`: Configuration file for Vercel deployment

## Development Roadmap
The project is planned to be enhanced with:
- Caching system for API responses
- Loading states and improved error handling
- Weather icons and expanded weather information
- Dark/light mode toggle
- Favorite cities feature
- 5-day weather forecast

## Known Limitations
- Currently only supports cities in South Africa
- Elevation data is not available from the current APIs
- Limited error handling for edge cases

## References
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/)
- [Vercel Deployment Guide](https://vercel.com/guides/using-express-with-vercel)
- [GeoDB Cities API](https://rapidapi.com/wirefreethought/api/geodb-cities)
- [Weatherbit API](https://rapidapi.com/weatherbit/api/weatherbit-v1-mashape)

## License
MIT License
