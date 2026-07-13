// api.ts — Open-Meteo API client

import type { AppState, WeatherData, AqiData } from './state.js';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export function fetchJsonWithTimeout(url: string, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { signal: controller.signal })
    .then(response => {
      if (!response.ok) {
        throw new Error('http_' + response.status);
      }
      return response.json() as Promise<unknown>;
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });
}

export function buildWeatherUrl(lat: number, lon: number): string {
  return (
    FORECAST_URL +
    '?latitude=' + lat +
    '&longitude=' + lon +
    '&current_weather=true' +
    '&hourly=temperature_2m,precipitation_probability,windspeed_10m,uv_index,visibility,relativehumidity_2m,surface_pressure,weathercode' +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,weathercode' +
    '&timezone=auto&forecast_days=7'
  );
}

export function buildAqiUrl(lat: number, lon: number): string {
  return (
    AQI_URL +
    '?latitude=' + lat +
    '&longitude=' + lon +
    '&current=european_aqi' +
    '&hourly=european_aqi' +
    '&timezone=auto'
  );
}

export function buildGeocodingUrl(query: string, lang: 'pl' | 'en'): string {
  const geoLang = lang === 'en' ? 'en' : 'pl';
  return GEOCODING_URL + '?name=' + encodeURIComponent(query) + '&count=5&language=' + geoLang;
}

export function fetchAll(s: Pick<AppState, 'lat' | 'lon'>): Promise<[WeatherData, AqiData | null]> {
  const weatherUrl = buildWeatherUrl(s.lat, s.lon);
  const aqiUrl = buildAqiUrl(s.lat, s.lon);

  return Promise.all([
    fetchJsonWithTimeout(weatherUrl, 12000).then(d => d as WeatherData),
    fetchJsonWithTimeout(aqiUrl, 12000)
      .then(d => d as AqiData)
      .catch(() => null),
  ]);
}
