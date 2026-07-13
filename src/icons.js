// icons.js — SVG icon generators and WMO weather code mapping

import { t } from './i18n.js';

export function iconSun() {
  return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="10" stroke="currentColor" stroke-width="2.5"/><line x1="24" y1="2" x2="24" y2="8" stroke="currentColor" stroke-width="2.5"/><line x1="24" y1="40" x2="24" y2="46" stroke="currentColor" stroke-width="2.5"/><line x1="2" y1="24" x2="8" y2="24" stroke="currentColor" stroke-width="2.5"/><line x1="40" y1="24" x2="46" y2="24" stroke="currentColor" stroke-width="2.5"/><line x1="8.3" y1="8.3" x2="12.5" y2="12.5" stroke="currentColor" stroke-width="2.5"/><line x1="35.5" y1="35.5" x2="39.7" y2="39.7" stroke="currentColor" stroke-width="2.5"/><line x1="8.3" y1="39.7" x2="12.5" y2="35.5" stroke="currentColor" stroke-width="2.5"/><line x1="35.5" y1="12.5" x2="39.7" y2="8.3" stroke="currentColor" stroke-width="2.5"/></svg>';
}

export function iconSunCloud() {
  return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="16" r="7" stroke="currentColor" stroke-width="2"/><line x1="18" y1="4" x2="18" y2="6" stroke="currentColor" stroke-width="2"/><line x1="18" y1="26" x2="18" y2="28" stroke="currentColor" stroke-width="2"/><line x1="8" y1="16" x2="6" y2="16" stroke="currentColor" stroke-width="2"/><line x1="30" y1="16" x2="28" y2="16" stroke="currentColor" stroke-width="2"/><path d="M14 30 C14 26 18 22 24 22 C28 22 31 24 32 27 C36 27.5 39 30 39 34 C39 38 36 40 32 40 L18 40 C14 40 12 37 12 34 C12 32 13 30.5 14 30Z" stroke="currentColor" stroke-width="2"/></svg>';
}

export function iconCloud() {
  return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 32 C8 32 6 29 6 26 C6 23 8 20 12 20 C12 14 17 10 23 10 C28 10 32 13 33 18 C37 18.5 40 21 40 25 C40 29 37 32 33 32Z" stroke="currentColor" stroke-width="2.5"/></svg>';
}

export function iconFog() {
  return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" stroke-width="2.5"/><line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" stroke-width="2.5"/><line x1="10" y1="30" x2="38" y2="30" stroke="currentColor" stroke-width="2.5"/><line x1="14" y1="36" x2="34" y2="36" stroke="currentColor" stroke-width="2.5"/></svg>';
}

export function iconDrizzle() {
  return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 26 C8 26 6 23 6 20 C6 17 8 14 12 14 C12 8 17 4 23 4 C28 4 32 7 33 12 C37 12.5 40 15 40 19 C40 23 37 26 33 26Z" stroke="currentColor" stroke-width="2"/><line x1="14" y1="32" x2="13" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="32" x2="21" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="30" y1="32" x2="29" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}

export function iconRain() {
  return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24 C8 24 6 21 6 18 C6 15 8 12 12 12 C12 6 17 2 23 2 C28 2 32 5 33 10 C37 10.5 40 13 40 17 C40 21 37 24 33 24Z" stroke="currentColor" stroke-width="2"/><line x1="14" y1="30" x2="12" y2="38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="23" y1="30" x2="21" y2="38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="32" y1="30" x2="30" y2="38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
}

export function iconSnow() {
  return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24 C8 24 6 21 6 18 C6 15 8 12 12 12 C12 6 17 2 23 2 C28 2 32 5 33 10 C37 10.5 40 13 40 17 C40 21 37 24 33 24Z" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="33" r="2" fill="currentColor"/><circle cx="24" cy="33" r="2" fill="currentColor"/><circle cx="34" cy="33" r="2" fill="currentColor"/><circle cx="19" cy="40" r="2" fill="currentColor"/><circle cx="29" cy="40" r="2" fill="currentColor"/></svg>';
}

export function iconStorm() {
  return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22 C8 22 6 19 6 16 C6 13 8 10 12 10 C12 4 17 0 23 0 C28 0 32 3 33 8 C37 8.5 40 11 40 15 C40 19 37 22 33 22Z" stroke="currentColor" stroke-width="2"/><polygon points="22,26 18,36 23,36 20,46 30,33 25,33 28,26" fill="currentColor"/></svg>';
}

/**
 * Map a WMO weather code to a description and icon function.
 * @param {number} code - WMO weather interpretation code
 * @param {'pl'|'en'} lang
 * @returns {{desc: string, icon: () => string}}
 */
export function weatherInfo(code, lang) {
  const map = {
    0: { desc: t('wmo0', lang), icon: iconSun },
    1: { desc: t('wmo1', lang), icon: iconSunCloud },
    2: { desc: t('wmo2', lang), icon: iconSunCloud },
    3: { desc: t('wmo3', lang), icon: iconCloud },
    45: { desc: t('wmo45', lang), icon: iconFog },
    48: { desc: t('wmo48', lang), icon: iconFog },
    51: { desc: t('wmo51', lang), icon: iconDrizzle },
    53: { desc: t('wmo53', lang), icon: iconDrizzle },
    55: { desc: t('wmo55', lang), icon: iconDrizzle },
    56: { desc: t('wmo56', lang), icon: iconDrizzle },
    57: { desc: t('wmo57', lang), icon: iconDrizzle },
    61: { desc: t('wmo61', lang), icon: iconRain },
    63: { desc: t('wmo63', lang), icon: iconRain },
    65: { desc: t('wmo65', lang), icon: iconRain },
    66: { desc: t('wmo66', lang), icon: iconRain },
    67: { desc: t('wmo67', lang), icon: iconRain },
    71: { desc: t('wmo71', lang), icon: iconSnow },
    73: { desc: t('wmo73', lang), icon: iconSnow },
    75: { desc: t('wmo75', lang), icon: iconSnow },
    77: { desc: t('wmo77', lang), icon: iconSnow },
    80: { desc: t('wmo80', lang), icon: iconRain },
    81: { desc: t('wmo81', lang), icon: iconRain },
    82: { desc: t('wmo82', lang), icon: iconRain },
    85: { desc: t('wmo85', lang), icon: iconSnow },
    86: { desc: t('wmo86', lang), icon: iconSnow },
    95: { desc: t('wmo95', lang), icon: iconStorm },
    96: { desc: t('wmo96', lang), icon: iconStorm },
    99: { desc: t('wmo99', lang), icon: iconStorm }
  };
  return map[code] || { desc: t('wmoUnknown', lang), icon: iconCloud };
}
