// api.js — Open-Meteo API client

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Fetch JSON with an AbortController timeout.
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<any>}
 */
export function fetchJsonWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { signal: controller.signal })
    .then(response => {
      if (!response.ok) {
        throw new Error('http_' + response.status);
      }
      return response.json();
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });
}

/**
 * Build the weather forecast API URL.
 * @param {number} lat
 * @param {number} lon
 * @returns {string}
 */
export function buildWeatherUrl(lat, lon) {
  return FORECAST_URL
    + '?latitude=' + lat
    + '&longitude=' + lon
    + '&current_weather=true'
    + '&hourly=temperature_2m,precipitation_probability,windspeed_10m,uv_index,visibility,relativehumidity_2m,surface_pressure,weathercode'
    + '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,weathercode'
    + '&timezone=auto&forecast_days=7';
}

/**
 * Build the air quality API URL.
 * @param {number} lat
 * @param {number} lon
 * @returns {string}
 */
export function buildAqiUrl(lat, lon) {
  return AQI_URL
    + '?latitude=' + lat
    + '&longitude=' + lon
    + '&current=european_aqi'
    + '&hourly=european_aqi'
    + '&timezone=auto';
}

/**
 * Build the geocoding search API URL.
 * @param {string} query
 * @param {'pl'|'en'} lang
 * @returns {string}
 */
export function buildGeocodingUrl(query, lang) {
  const geoLang = lang === 'en' ? 'en' : 'pl';
  return GEOCODING_URL + '?name=' + encodeURIComponent(query) + '&count=5&language=' + geoLang;
}

/**
 * Fetch weather and AQI data in parallel.
 * @param {{lat: number, lon: number}} state
 * @returns {Promise<[any, any|null]>} [weather, aqi]
 */
export function fetchAll(state) {
  const weatherUrl = buildWeatherUrl(state.lat, state.lon);
  const aqiUrl = buildAqiUrl(state.lat, state.lon);

  return Promise.all([
    fetchJsonWithTimeout(weatherUrl, 12000),
    fetchJsonWithTimeout(aqiUrl, 12000).catch(() => null)
  ]);
}
