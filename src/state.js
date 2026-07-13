// state.js — Application state management

export const STORAGE_KEY = 'weather-app-v1';
export const THEME_KEY = STORAGE_KEY + ':theme';

export const DEFAULT_STATE = {
  lat: 50.06,
  lon: 19.94,
  cityName: 'Krakow',
  unit: 'C',
  lang: 'pl',
  weather: null,
  aqi: null
};

/**
 * Shared mutable application state singleton.
 * Modules import this object and read/mutate its properties.
 * @type {typeof DEFAULT_STATE}
 */
export const state = loadSavedState();

/**
 * Load saved state from localStorage, falling back to defaults.
 * @returns {typeof DEFAULT_STATE}
 */
export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);

    return {
      ...DEFAULT_STATE,
      lat: Number.isFinite(parsed.lat) ? parsed.lat : DEFAULT_STATE.lat,
      lon: Number.isFinite(parsed.lon) ? parsed.lon : DEFAULT_STATE.lon,
      cityName: typeof parsed.cityName === 'string' && parsed.cityName.trim() ? parsed.cityName : DEFAULT_STATE.cityName,
      unit: parsed.unit === 'F' ? 'F' : 'C',
      lang: parsed.lang === 'en' ? 'en' : 'pl',
      weather: null,
      aqi: null
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/**
 * Persist the user-editable parts of state to localStorage.
 * @param {object} state
 */
export function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      lat: state.lat,
      lon: state.lon,
      cityName: state.cityName,
      unit: state.unit,
      lang: state.lang
    }));
  } catch {
    // Ignore quota errors.
  }
}

/**
 * Save the theme preference to localStorage.
 * @param {'light'|'dark'} theme
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore quota errors.
  }
}

/**
 * Read the saved theme and apply it to the document element.
 * @param {HTMLElement} themeBtn - button to update aria-pressed
 */
export function applySavedTheme(themeBtn) {
  let theme = 'light';
  try {
    const fromStorage = localStorage.getItem(THEME_KEY);
    if (fromStorage === 'dark' || fromStorage === 'light') theme = fromStorage;
  } catch {
    theme = 'light';
  }

  document.documentElement.setAttribute('data-theme', theme);
  if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
}
