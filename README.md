## The Daily Drift: Modern Weather Application

The Daily Drift is a premium, web-based application that fetches and displays highly detailed data about cities and their current weather conditions. The data is retrieved in real-time using the robust Open-Meteo APIs (Geocoding and Weather).

## Live Demo
The application is deployed on Vercel and can be accessed at [https://city-weather-app-sandy.vercel.app/](https://city-weather-app-sandy.vercel.app/).

## Technologies & Design Architecture
- **Backend Environment**: Node.js, Express.js
- **Frontend Core**: Vanilla HTML5, CSS3, JavaScript
- **Data Provider**: Open-Meteo API (Server-side fetching)
- **Deployment**: Vercel (Serverless Functions)
- **Design System**: Responsive Glassmorphism UI
- **Iconography**: Lucide Icons (Dynamically mapped to WMO weather codes)

## Features
- **Search Engine**: Search for any city globally with error handling for unfound locations.
- **Dynamic Theming**: The application automatically changes background gradients based on the current weather condition (Clear, Rain, Snow, Thunder, etc.).
- **Automated Day/Night Mode**: The UI intelligently queries the timezone of the searched city. If it's daytime, the app utilizes frosted white glass and bright gradients. At night, it transitions to a dark, moody aesthetic.
- **Current Details**: View detailed city metrics (population, exact coordinates, humidity, wind speed, pressure, and "feels like" temperature).
- **24-Hour Forecast**: A horizontally scrollable timeline predicting conditions, temperatures, and precipitation probabilities.
- **7-Day Forecast**: A vertically structured grid extending the forecast a week out, featuring dual day/night icons, precipitation tracking, and high/low temperature ranges.

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/arnoldtwl/city-weather-app.git
   cd city-weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## Project Structure
- `/api/index.js`: The server-side Express script operating as a proxy to Open-Meteo.
- `/public/index.html`: The semantic HTML layout of the three glass cards.
- `/public/script.js`: Client-side logic controlling DOM injection, API handling, Date formatting, and Day/Night mode toggling.
- `/public/style.css`: Comprehensive CSS powering the glassmorphism variables, flexbox/grid layouts, responsive breakpoints, and weather-state gradient maps.

## Known Limitations
- The application currently relies on the free tier of Open-Meteo APIs. Rate limits or service interruptions may occasionally affect availability.

## References
- [Open-Meteo Documentation](https://open-meteo.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vercel Deployment Guide](https://vercel.com/guides/using-express-with-vercel)

## License
MIT License
