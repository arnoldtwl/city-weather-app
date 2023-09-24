// This file contains the client-side JavaScript code for the application.
// It is loaded by the HTML page, and contains code to call the API, and to display the results.
// The code is executed when the DOMContentLoaded event is fired, which is when the HTML page is loaded and ready.
// The code is wrapped in a DOMContentLoaded event listener, to ensure that the code is executed when the event is fired.
document.addEventListener('DOMContentLoaded', () => {
  // Variables to reference the HTML elements
  const cityForm = document.getElementById("cityForm");
  const cityInput = document.getElementById("cityInput");
  const resultContainer = document.getElementById("resultContainer");
  const cityElement = document.getElementById("city");
  const provinceElement = document.getElementById("province");
  const countryElement = document.getElementById("country");
  const longitudeElement = document.getElementById("longitude");
  const latitudeElement = document.getElementById("latitude");
  const populationElement = document.getElementById("population");
  const elevationElement = document.getElementById("elevation");
  const temperatureElement = document.getElementById("temperature");
  const weatherElement = document.getElementById("weather");

  // Add an event listener to the form, to listen for the submit event
  cityForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    // to avoid reloading the page, when the user clicks the submit button
    event.preventDefault();

    // Get the value of the input field, which contains the city name
    const cityName = cityInput.value;

    // This is the try-catch block that is used to handle any errors that might occur
    try {
      // Call the API, to get the city information, using the cityName variable
      const response = await fetch(`/city-info?cityName=${encodeURIComponent(cityName)}`);
      // The response variable contains the response from the API, which is then converted to JSON
      const data = await response.json();
      console.log(data); // Log the response data

      // Check if the data variable contains any data
      if (data) {
        // Update the HTML elements with the data from the API
        // The data variable contains the data from the API
        // If the data is not available, then the default value is used
        cityElement.textContent = data.city || "Not available";
        provinceElement.textContent = data.region || "Not available";
        countryElement.textContent = data.country || "Not available";
        longitudeElement.textContent = data.longitude || "Not available";
        latitudeElement.textContent = data.latitude || "Not available";
        populationElement.textContent = data.population || "Not available";
        // elevation data is not available in the API
        // elevationElement.textContent = data.elevation || "Not available";
        weatherElement.textContent = data.weatherDescription || "Not available";
        temperatureElement.textContent = data.currentTemperature ? `${data.currentTemperature} °C` : 'No temperature data available';
        // Display the result container
        resultContainer.style.display = 'block';
      } else {
        console.log(`City '${cityName}' not found.`);
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  });
});
