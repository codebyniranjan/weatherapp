/**
 * ========================================
 * WEATHER MODULE
 * ========================================
 * Handles all weather data fetching and processing
 * Academic Purpose: Demonstrates API integration, async/await, error handling, and data transformation
 */

// ========================================
// CONFIGURATION
// ========================================
const WEATHER_CONFIG = {
    API_KEY: '9eadcf9f429cb9cdb40bf6e7e9259a7e', // OpenWeatherMap API key
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    GEO_URL: 'https://api.openweathermap.org/geo/1.0',
    ICON_URL: 'https://openweathermap.org/img/wn',
    DEFAULT_CITY: 'Thiruvananthapuram',
    CACHE_DURATION: 10 * 60 * 1000 // 10 minutes in milliseconds
};

// ========================================
// CACHE MANAGEMENT
// ========================================
const weatherCache = {
    current: {},
    forecast: {}
};

/**
 * Check if cached data is still valid
 * @param {Object} cacheEntry - Cache entry with timestamp
 * @returns {boolean} True if cache is valid
 */
function isCacheValid(cacheEntry) {
    if (!cacheEntry || !cacheEntry.timestamp) return false;
    const now = Date.now();
    return (now - cacheEntry.timestamp) < WEATHER_CONFIG.CACHE_DURATION;
}

// ========================================
// API FETCH FUNCTIONS
// ========================================

/**
 * Fetch current weather data for a city
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data
 */
async function fetchCurrentWeather(city) {
    // Check cache first
    if (isCacheValid(weatherCache.current[city])) {
        console.log('Using cached current weather data for', city);
        return weatherCache.current[city].data;
    }

    try {
        const url = `${WEATHER_CONFIG.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_CONFIG.API_KEY}&units=metric`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('API key error. Please contact support.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again.');
            }
        }

        const data = await response.json();
        
        // Cache the data
        weatherCache.current[city] = {
            data: data,
            timestamp: Date.now()
        };

        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        throw error;
    }
}

/**
 * Fetch 5-day forecast data
 * @param {string} city - City name
 * @returns {Promise<Object>} Forecast data
 */
async function fetchForecastWeather(city) {
    // Check cache first
    if (isCacheValid(weatherCache.forecast[city])) {
        console.log('Using cached forecast data for', city);
        return weatherCache.forecast[city].data;
    }

    try {
        const url = `${WEATHER_CONFIG.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${WEATHER_CONFIG.API_KEY}&units=metric`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found for forecast data.');
            } else {
                throw new Error('Failed to fetch forecast data.');
            }
        }

        const data = await response.json();
        
        // Cache the data
        weatherCache.forecast[city] = {
            data: data,
            timestamp: Date.now()
        };

        return data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
}

// ========================================
// DATA PROCESSING FUNCTIONS
// ========================================

/**
 * Convert temperature based on user preference
 * @param {number} celsius - Temperature in Celsius
 * @param {string} unit - Target unit ('celsius' or 'fahrenheit')
 * @returns {number} Converted temperature
 */
function convertTemperature(celsius, unit) {
    if (unit === 'fahrenheit') {
        return (celsius * 9/5) + 32;
    }
    return celsius;
}

/**
 * Get weather icon URL
 * @param {string} iconCode - OpenWeatherMap icon code
 * @returns {string} Full icon URL
 */
function getWeatherIconUrl(iconCode) {
    return `${WEATHER_CONFIG.ICON_URL}/${iconCode}@2x.png`;
}

/**
 * Format weather data for display
 * @param {Object} data - Raw API data
 * @param {string} unit - Temperature unit preference
 * @returns {Object} Formatted weather data
 */
function formatWeatherData(data, unit = 'celsius') {
    const temp = convertTemperature(data.main.temp, unit);
    const feelsLike = convertTemperature(data.main.feels_like, unit);
    const tempMin = convertTemperature(data.main.temp_min, unit);
    const tempMax = convertTemperature(data.main.temp_max, unit);
    const unitSymbol = unit === 'celsius' ? '°C' : '°F';

    return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(temp),
        feelsLike: Math.round(feelsLike),
        tempMin: Math.round(tempMin),
        tempMax: Math.round(tempMax),
        description: data.weather[0].description,
        main: data.weather[0].main,
        icon: data.weather[0].icon,
        iconUrl: getWeatherIconUrl(data.weather[0].icon),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDeg: data.wind.deg,
        clouds: data.clouds.all,
        visibility: Math.round(data.visibility / 1000), // Convert to km
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
        timezone: data.timezone,
        unitSymbol: unitSymbol,
        timestamp: new Date(data.dt * 1000)
    };
}

/**
 * Process 5-day forecast into daily summaries
 * @param {Object} forecastData - Raw forecast API data
 * @param {string} unit - Temperature unit preference
 * @returns {Array} Array of daily forecast objects
 */
function processDailyForecast(forecastData, unit = 'celsius') {
    const dailyData = {};
    const unitSymbol = unit === 'celsius' ? '°C' : '°F';

    // Group forecasts by date
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

        if (!dailyData[dateKey]) {
            dailyData[dateKey] = {
                date: dateKey,
                temps: [],
                conditions: [],
                icons: [],
                humidity: [],
                wind: []
            };
        }

        dailyData[dateKey].temps.push(item.main.temp);
        dailyData[dateKey].conditions.push(item.weather[0].main);
        dailyData[dateKey].icons.push(item.weather[0].icon);
        dailyData[dateKey].humidity.push(item.main.humidity);
        dailyData[dateKey].wind.push(item.wind.speed);
    });

    // Convert to array and calculate aggregates
    return Object.values(dailyData).map(day => {
        const temps = day.temps;
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);
        
        // Get most common condition
        const conditionCounts = {};
        day.conditions.forEach(c => {
            conditionCounts[c] = (conditionCounts[c] || 0) + 1;
        });
        const dominantCondition = Object.keys(conditionCounts).reduce((a, b) => 
            conditionCounts[a] > conditionCounts[b] ? a : b
        );

        // Get midday icon (around noon)
        const middayIcon = day.icons[Math.floor(day.icons.length / 2)];

        return {
            date: new Date(day.date),
            dateString: new Date(day.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            }),
            minTemp: Math.round(convertTemperature(minTemp, unit)),
            maxTemp: Math.round(convertTemperature(maxTemp, unit)),
            condition: dominantCondition,
            icon: middayIcon,
            iconUrl: getWeatherIconUrl(middayIcon),
            avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
            avgWind: Math.round(day.wind.reduce((a, b) => a + b, 0) / day.wind.length * 10) / 10,
            unitSymbol: unitSymbol
        };
    }).slice(0, 5); // Return only 5 days
}

/**
 * Process hourly forecast (next 24 hours)
 * @param {Object} forecastData - Raw forecast API data
 * @param {string} unit - Temperature unit preference
 * @returns {Array} Array of hourly forecast objects (8 items = 24 hours)
 */
function processHourlyForecast(forecastData, unit = 'celsius') {
    const unitSymbol = unit === 'celsius' ? '°C' : '°F';
    
    return forecastData.list.slice(0, 8).map(item => {
        const date = new Date(item.dt * 1000);
        return {
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            temp: Math.round(convertTemperature(item.main.temp, unit)),
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
            iconUrl: getWeatherIconUrl(item.weather[0].icon),
            pop: Math.round(item.pop * 100), // Probability of precipitation
            unitSymbol: unitSymbol
        };
    });
}

// ========================================
// WEATHER ALERTS LOGIC
// ========================================

/**
 * Generate weather alerts based on conditions
 * @param {Object} weatherData - Current weather data
 * @returns {Array} Array of alert objects
 */
function generateWeatherAlerts(weatherData) {
    const alerts = [];
    
    // High temperature alert
    if (weatherData.temperature > 35) {
        alerts.push({
            type: 'heat',
            severity: 'high',
            title: 'Extreme Heat Warning',
            message: `Temperature is ${weatherData.temperature}${weatherData.unitSymbol}. Stay hydrated and avoid prolonged sun exposure.`,
            icon: '🌡️'
        });
    } else if (weatherData.temperature > 30) {
        alerts.push({
            type: 'heat',
            severity: 'medium',
            title: 'Heat Advisory',
            message: `Temperature is ${weatherData.temperature}${weatherData.unitSymbol}. Take precautions in the heat.`,
            icon: '☀️'
        });
    }

    // Low temperature alert
    if (weatherData.temperature < 10) {
        alerts.push({
            type: 'cold',
            severity: 'medium',
            title: 'Cold Weather Alert',
            message: `Temperature is ${weatherData.temperature}${weatherData.unitSymbol}. Dress warmly.`,
            icon: '❄️'
        });
    }

    // High wind alert
    if (weatherData.windSpeed > 15) {
        alerts.push({
            type: 'wind',
            severity: 'high',
            title: 'Strong Wind Warning',
            message: `Wind speed is ${weatherData.windSpeed} m/s. Secure loose objects and avoid outdoor activities.`,
            icon: '💨'
        });
    } else if (weatherData.windSpeed > 10) {
        alerts.push({
            type: 'wind',
            severity: 'medium',
            title: 'Windy Conditions',
            message: `Wind speed is ${weatherData.windSpeed} m/s. Be cautious outdoors.`,
            icon: '🌬️'
        });
    }

    // Rain/Storm alerts
    if (weatherData.main === 'Rain' || weatherData.main === 'Drizzle') {
        alerts.push({
            type: 'rain',
            severity: 'medium',
            title: 'Rain Alert',
            message: 'Rain expected. Carry an umbrella and drive carefully.',
            icon: '🌧️'
        });
    }

    if (weatherData.main === 'Thunderstorm') {
        alerts.push({
            type: 'storm',
            severity: 'high',
            title: 'Thunderstorm Warning',
            message: 'Thunderstorm in the area. Stay indoors and avoid electrical equipment.',
            icon: '⛈️'
        });
    }

    // Poor visibility alert
    if (weatherData.visibility < 2) {
        alerts.push({
            type: 'visibility',
            severity: 'medium',
            title: 'Poor Visibility',
            message: `Visibility is ${weatherData.visibility} km. Drive with caution.`,
            icon: '🌫️'
        });
    }

    // High humidity alert
    if (weatherData.humidity > 85) {
        alerts.push({
            type: 'humidity',
            severity: 'low',
            title: 'High Humidity',
            message: `Humidity is ${weatherData.humidity}%. It may feel uncomfortable.`,
            icon: '💧'
        });
    }

    return alerts;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get user's location using browser geolocation
 * @returns {Promise<Object>} Coordinates {lat, lon}
 */
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                reject(new Error('Unable to retrieve your location'));
            }
        );
    });
}

/**
 * Fetch weather by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherByCoordinates(lat, lon) {
    try {
        const url = `${WEATHER_CONFIG.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_CONFIG.API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather by location');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching weather by coordinates:', error);
        throw error;
    }
}
