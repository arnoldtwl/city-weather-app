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
   * Maps WMO codes to Lucide icon names for night time
   */
  function getNightIcon(code) {
    const mapping = {
      0: 'moon',
      1: 'cloud-moon',
      2: 'cloud-moon',
      3: 'cloud',
      45: 'cloud-fog',
      48: 'cloud-fog',
      51: 'cloud-drizzle',
      53: 'cloud-drizzle',
      55: 'cloud-drizzle',
      61: 'cloud-rain',
      63: 'cloud-rain',
      65: 'cloud-rain',
      71: 'snowflake',
      73: 'snowflake',
      75: 'snowflake',
      80: 'cloud-rain',
      81: 'cloud-rain',
      82: 'cloud-rain',
      95: 'cloud-lightning',
      96: 'cloud-lightning',
      99: 'cloud-lightning'
    };
    return mapping[code] || 'cloud-moon';
  }

  /**
   * Helper to format Date to "Yesterday", "Today", or Short Weekday
   */
  function formatDayName(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Calculate difference by creating a local date stripped of time to avoid timezone offset issues at midnight
    const localDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
    localDate.setHours(0, 0, 0, 0);

    const diffTime = localDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 0) return 'Today';

    return localDate.toLocaleDateString('en-US', { weekday: 'short' });
  }

  /**
   * Helper to show/hide elements
   */
  function toggleDisplay(element, show) {
    if (!element) return;
    element.style.display = show ? 'flex' : 'none';
    if (show && element.classList.contains('glass-card') || show && element.classList.contains('daily-forecast-container') || show && element.classList.contains('forecast-container')) {
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

    const forecastContainers = document.querySelectorAll('.forecast-container, .daily-forecast-container');
    forecastContainers.forEach(c => toggleDisplay(c, false));

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
        document.getElementById('elevation').textContent = data.elevation !== 'Not available' ? `${data.elevation}m` : '--';
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

        // Update Background Theme (Including Day/Night Mode)
        const baseTheme = weatherVisuals.theme;
        document.body.className = data.isDay ? `${baseTheme} theme-light` : baseTheme;

        // Populate Hourly Forecast
        const hourlyContainer = document.getElementById('hourlyForecast');
        hourlyContainer.innerHTML = ''; // Clear previous

        if (data.hourlyForecast && data.hourlyForecast.length > 0) {
          data.hourlyForecast.forEach(hour => {
            const dateObj = new Date(hour.time);
            // Format time as HH:00 (e.g., 14:00)
            const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const hourlyVisuals = getWeatherData(hour.weatherCode);

            const itemHtml = `
                    <div class="forecast-item">
                        <span class="forecast-time">${timeString}</span>
                        <div class="forecast-precipitation">
                            <i data-lucide="droplets"></i>
                            <span>${hour.precipitationProb}%</span>
                        </div>
                        <div class="forecast-icon-wrapper">
                            <i data-lucide="${hourlyVisuals.icon}"></i>
                        </div>
                        <span class="forecast-temp">${Math.round(hour.temperature)}°</span>
                    </div>
                `;
            hourlyContainer.insertAdjacentHTML('beforeend', itemHtml);
          });
          lucide.createIcons(); // Initialize the new forecast icons
        }

        // Populate Daily Forecast
        const dailyContainer = document.getElementById('dailyForecast');
        if (dailyContainer) {
          dailyContainer.innerHTML = ''; // Clear previous
          if (data.dailyForecast && data.dailyForecast.length > 0) {
            data.dailyForecast.forEach(day => {
              const dayName = formatDayName(day.date);
              const dayVisuals = getWeatherData(day.weatherCode);
              const nightIcon = getNightIcon(day.weatherCode);

              const itemHtml = `
                        <div class="daily-forecast-item">
                            <span class="daily-day">${dayName}</span>
                            <div class="daily-precipitation">
                                <i data-lucide="droplets"></i>
                                <span>${day.precipitationProb}%</span>
                            </div>
                            <div class="daily-icons">
                                <i data-lucide="${dayVisuals.icon}"></i>
                                <i data-lucide="${nightIcon}"></i>
                            </div>
                            <div class="daily-temps">
                                <span class="temp-high">${Math.round(day.maxTemp)}°</span>
                                <span class="temp-low">${Math.round(day.minTemp)}°</span>
                            </div>
                        </div>
                    `;
              dailyContainer.insertAdjacentHTML('beforeend', itemHtml);
            });
          }
        }

        lucide.createIcons(); // Initialize all new forecast icons

        // Display results
        toggleDisplay(resultContainer, true);
        const forecastContainers = document.querySelectorAll('.forecast-container, .daily-forecast-container');
        forecastContainers.forEach(c => toggleDisplay(c, true));
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
