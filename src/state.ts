// state.ts — Application state management

import type { Lang } from './i18n.js';
import type { Unit } from './utils.js';

export const STORAGE_KEY = 'weather-app-v1';
export const THEME_KEY = STORAGE_KEY + ':theme';

export interface AppState {
  lat: number;
  lon: number;
  cityName: string;
  unit: Unit;
  lang: Lang;
  weather: WeatherData | null;
  aqi: AqiData | null;
}

export interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    windspeed_10m: number[];
    uv_index: number[];
    visibility: number[];
    relativehumidity_2m: number[];
    surface_pressure: number[];
    weathercode: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
    weathercode: number[];
  };
}

export interface AqiData {
  current?: { european_aqi: number | null };
  hourly?: { time: string[]; european_aqi: number[] };
}

export const DEFAULT_STATE: AppState = {
  lat: 50.06,
  lon: 19.94,
  cityName: 'Krakow',
  unit: 'C',
  lang: 'pl',
  weather: null,
  aqi: null,
};

/**
 * Shared mutable application state singleton.
 * Modules import this object and read/mutate its properties.
 */
export const state: AppState = loadSavedState();

export function loadSavedState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<AppState>;

    return {
      ...DEFAULT_STATE,
      lat: Number.isFinite(parsed.lat) ? (parsed.lat as number) : DEFAULT_STATE.lat,
      lon: Number.isFinite(parsed.lon) ? (parsed.lon as number) : DEFAULT_STATE.lon,
      cityName:
        typeof parsed.cityName === 'string' && parsed.cityName.trim()
          ? parsed.cityName
          : DEFAULT_STATE.cityName,
      unit: parsed.unit === 'F' ? 'F' : 'C',
      lang: parsed.lang === 'en' ? 'en' : 'pl',
      weather: null,
      aqi: null,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function persistState(s: AppState): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lat: s.lat,
        lon: s.lon,
        cityName: s.cityName,
        unit: s.unit,
        lang: s.lang,
      })
    );
  } catch {
    // Ignore quota errors.
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore quota errors.
  }
}

export function applySavedTheme(themeBtn: HTMLButtonElement | null): void {
  let theme: 'light' | 'dark' = 'light';
  try {
    const fromStorage = localStorage.getItem(THEME_KEY);
    if (fromStorage === 'dark' || fromStorage === 'light') theme = fromStorage;
  } catch {
    theme = 'light';
  }

  document.documentElement.setAttribute('data-theme', theme);
  if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
}
