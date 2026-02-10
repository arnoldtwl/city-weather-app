document.addEventListener('DOMContentLoaded', () => {
  const cityForm = document.getElementById("cityForm");
  const cityInput = document.getElementById("cityInput");
  const resultContainer = document.getElementById("resultContainer");
  const cityElement = document.getElementById("city");
  const provinceElement = document.getElementById("province");
  const countryElement = document.getElementById("country");
  const longitudeElement = document.getElementById("longitude");
  const latitudeElement = document.getElementById("latitude");
  const populationElement = document.getElementById("population");
  const temperatureElement = document.getElementById("temperature");
  const weatherElement = document.getElementById("weather");
  const weatherIconLarge = document.getElementById("weatherIconLarge");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorContainer = document.getElementById("errorContainer");
  const errorMessage = document.getElementById("errorMessage");

  // Initialize Lucide icons
  lucide.createIcons();

  /**
   * Maps WMO codes to Lucide icon names and background themes
   */
  function getWeatherData(code) {
    const mapping = {
      0: { icon: 'sun', theme: 'theme-clear' },
      1: { icon: 'cloud-sun', theme: 'theme-clear' },
      2: { icon: 'cloud-sun', theme: 'theme-clouds' },
      3: { icon: 'cloud', theme: 'theme-clouds' },
      45: { icon: 'cloud-fog', theme: 'theme-clouds' },
      48: { icon: 'cloud-fog', theme: 'theme-clouds' },
      51: { icon: 'cloud-drizzle', theme: 'theme-rain' },
      53: { icon: 'cloud-drizzle', theme: 'theme-rain' },
      55: { icon: 'cloud-drizzle', theme: 'theme-rain' },
      61: { icon: 'cloud-rain', theme: 'theme-rain' },
      63: { icon: 'cloud-rain', theme: 'theme-rain' },
      65: { icon: 'cloud-rain', theme: 'theme-rain' },
      71: { icon: 'snowflake', theme: 'theme-snow' },
      73: { icon: 'snowflake', theme: 'theme-snow' },
      75: { icon: 'snowflake', theme: 'theme-snow' },
      80: { icon: 'cloud-rain', theme: 'theme-rain' },
      81: { icon: 'cloud-rain', theme: 'theme-rain' },
      82: { icon: 'cloud-rain', theme: 'theme-rain' },
      95: { icon: 'cloud-lightning', theme: 'theme-thunder' },
      96: { icon: 'cloud-lightning', theme: 'theme-thunder' },
      99: { icon: 'cloud-lightning', theme: 'theme-thunder' }
    };

    return mapping[code] || { icon: 'cloud-sun', theme: 'theme-default' };
  }

  /**
   * Helper to show/hide elements
   */
  function toggleDisplay(element, show) {
    if (!element) return;
    element.style.display = show ? 'flex' : 'none';
    if (show && element.classList.contains('glass-card')) {
      element.style.display = 'block'; // block for cards
    }
  }

  cityForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    const submitButton = cityForm.querySelector('button');

    // Cleanup previous state
    toggleDisplay(resultContainer, false);
    toggleDisplay(errorContainer, false);
    toggleDisplay(loadingSpinner, true);
    submitButton.disabled = true;

    try {
      const response = await fetch(`/city-info?cityName=${encodeURIComponent(cityName)}`);
      const data = await response.json();
      console.log(data);

      toggleDisplay(loadingSpinner, false);

      if (response.ok && data && !data.error) {
        // Update text content
        cityElement.textContent = data.city || "Not available";
        provinceElement.textContent = data.region || "Not available";
        countryElement.textContent = data.country || "Not available";
        longitudeElement.textContent = data.longitude || "Not available";
        latitudeElement.textContent = data.latitude || "Not available";
        populationElement.textContent = data.population?.toLocaleString() || "Not available";
        weatherElement.textContent = data.weatherDescription || "Not available";
        temperatureElement.textContent = data.currentTemperature;

        // Update new metrics
        document.getElementById('humidity').textContent = data.humidity != null ? `${data.humidity}%` : '--';
        document.getElementById('feelsLike').textContent = data.feelsLike != null ? `${data.feelsLike}°C` : '--';
        document.getElementById('windSpeed').textContent = data.widthSpeed != null ? `${data.widthSpeed} km/h` : '--';
        document.getElementById('pressure').textContent = data.pressure != null ? `${data.pressure} hPa` : '--';

        // Update Icon and Theme
        const weatherVisuals = getWeatherData(data.weatherCode);

        // Update Icon
        weatherIconLarge.innerHTML = `<i data-lucide="${weatherVisuals.icon}"></i>`;
        lucide.createIcons(); // Re-initialize icons for the newly added one

        // Update Background Theme
        document.body.className = weatherVisuals.theme;

        // Display result
        toggleDisplay(resultContainer, true);
        resultContainer.scrollIntoView({ behavior: 'smooth' });
      } else {
        throw new Error(data.error || `City '${cityName}' not found.`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toggleDisplay(loadingSpinner, false);
      errorMessage.textContent = error.message;
      toggleDisplay(errorContainer, true);
      lucide.createIcons(); // Re-initialize alert icon
    } finally {
      submitButton.disabled = false;
    }
  });
});
