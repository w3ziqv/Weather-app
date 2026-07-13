// utils.js — Pure utility functions (no DOM, no side-effects)
// All functions accept their dependencies as parameters for easy testing.

import { I18N, t } from './i18n.js';

/**
 * Convert Celsius to the target unit and round to integer.
 * @param {number} celsius
 * @param {'C'|'F'} unit
 * @returns {number}
 */
export function toUnit(celsius, unit) {
  if (unit === 'F') return Math.round(celsius * 9 / 5 + 32);
  return Math.round(celsius);
}

/**
 * Return the degree symbol for the current unit.
 * @param {'C'|'F'} unit
 * @returns {string}
 */
export function unitSymbol(unit) {
  return unit === 'F' ? '\u00B0F' : '\u00B0C';
}

/**
 * Convert an AQI value to a 0-100 percentage (capped at 100).
 * @param {number} val - European AQI value
 * @returns {number}
 */
export function aqiPercent(val) {
  return Math.min(100, Math.round((val / 150) * 100));
}

/**
 * Human-readable AQI category in the given language.
 * @param {number} val - European AQI value
 * @param {'pl'|'en'} lang
 * @returns {string}
 */
export function aqiDescription(val, lang) {
  if (val <= 20) return t('aqiVeryGood', lang);
  if (val <= 40) return t('aqiGood', lang);
  if (val <= 60) return t('aqiModerate', lang);
  if (val <= 80) return t('aqiBad', lang);
  if (val <= 100) return t('aqiVeryBad', lang);
  return t('aqiHazardous', lang);
}

/**
 * Calculate sun progress as a 0-100 percentage.
 * Returns 0 before sunrise, 100 after sunset.
 * @param {string|Date} sunrise - ISO string or Date
 * @param {string|Date} sunset - ISO string or Date
 * @param {Date} [now] - override current time (for testing)
 * @returns {number}
 */
export function sunProgress(sunrise, sunset, now = new Date()) {
  const rise = new Date(sunrise);
  const set = new Date(sunset);

  if (now < rise) return 0;
  if (now > set) return 100;

  return Math.round(((now - rise) / (set - rise)) * 100);
}

/**
 * Short weekday name for the given date string.
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @param {'pl'|'en'} lang
 * @returns {string}
 */
export function shortDay(dateStr, lang) {
  const days = lang === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Ndz', 'Pon', 'Wt', 'Sr', 'Czw', 'Pt', 'Sob'];
  const d = new Date(dateStr + 'T00:00:00');
  return days[d.getDay()];
}

/**
 * Find the hourly index closest to the current time.
 * @param {string[]} times - array of ISO timestamps
 * @param {Date} [now] - override current time (for testing)
 * @returns {number}
 */
export function getCurrentHourIndex(times, now = new Date()) {
  let best = 0;
  let bestDiff = Infinity;

  for (let i = 0; i < times.length; i++) {
    const time = new Date(times[i]);
    const diff = Math.abs(now - time);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }

  return best;
}

/**
 * Format an ISO timestamp as "HH:00".
 * @param {string} isoStr
 * @returns {string}
 */
export function formatHour(isoStr) {
  const d = new Date(isoStr);
  return String(d.getHours()).padStart(2, '0') + ':00';
}

/**
 * Format an ISO timestamp as "HH:MM".
 * @param {string} isoStr
 * @returns {string}
 */
export function formatSunTime(isoStr) {
  const d = new Date(isoStr);
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

/**
 * Escape a string for safe insertion into innerHTML.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str == null ? '' : String(str)));
  return div.innerHTML;
}
