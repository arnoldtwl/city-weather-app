## City & Weather Information App

This project is a web-based application that fetches and displays data about cities and their current weather conditions. The data is retrieved using the Open-Meteo APIs (Geocoding and Weather).

## Live Demo
The application is deployed on Vercel and can be accessed at [https://city-weather-app-sandy.vercel.app/](https://city-weather-app-sandy.vercel.app/).

## Technologies Used
- Node.js
- Express.js
- Open-Meteo API
- HTML5
- CSS
- JavaScript
- Vercel (for serverless deployment)

## Features
- Search for any city
- View detailed city information (population, coordinates, etc.)
- Get current weather conditions and temperature
- Responsive design for mobile and desktop

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

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

3. Run the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## Project Structure
- `/api/index.js`: The server-side JavaScript file that handles API requests
- `/public/index.html`: The HTML file that provides the frontend interface
- `/public/script.js`: The client-side JavaScript for user interactions and API calls
- `/public/style.css`: CSS styling for the frontend
- `/vercel.json`: Configuration file for Vercel deployment

## Development Roadmap
The project is planned to be enhanced with:
- 24-hour weather forecast, starting from the current hour, vertically and scrollable
- 7-day weather forecast, horizontally
- Dark/light mode toggle


## Known Limitations
- Elevation data is not available from the current APIs
- Limited error handling for edge cases

## References
- [Open-Meteo Documentation](https://open-meteo.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/)
- [Vercel Deployment Guide](https://vercel.com/guides/using-express-with-vercel)

## License
MIT License
