// utils.ts — Pure utility functions (no DOM, no side-effects)

import { t, type Lang } from './i18n.js';

export type Unit = 'C' | 'F';

export function toUnit(celsius: number, unit: Unit): number {
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
  return Math.round(celsius);
}

export function unitSymbol(unit: Unit): string {
  return unit === 'F' ? '\u00B0F' : '\u00B0C';
}

export function aqiPercent(val: number): number {
  return Math.min(100, Math.round((val / 150) * 100));
}

export function aqiDescription(val: number, lang: Lang): string {
  if (val <= 20) return t('aqiVeryGood', lang);
  if (val <= 40) return t('aqiGood', lang);
  if (val <= 60) return t('aqiModerate', lang);
  if (val <= 80) return t('aqiBad', lang);
  if (val <= 100) return t('aqiVeryBad', lang);
  return t('aqiHazardous', lang);
}

export function sunProgress(sunrise: string | Date, sunset: string | Date, now: Date = new Date()): number {
  const rise = new Date(sunrise);
  const set = new Date(sunset);

  if (now < rise) return 0;
  if (now > set) return 100;

  return Math.round(((now.getTime() - rise.getTime()) / (set.getTime() - rise.getTime())) * 100);
}

export function shortDay(dateStr: string, lang: Lang): string {
  const days: Record<Lang, string[]> = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    pl: ['Ndz', 'Pon', 'Wt', 'Sr', 'Czw', 'Pt', 'Sob'],
  };
  const d = new Date(dateStr + 'T00:00:00');
  return days[lang][d.getDay()];
}

export function getCurrentHourIndex(times: string[], now: Date = new Date()): number {
  let best = 0;
  let bestDiff = Infinity;

  for (let i = 0; i < times.length; i++) {
    const time = new Date(times[i]);
    const diff = Math.abs(now.getTime() - time.getTime());
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }

  return best;
}

export function formatHour(isoStr: string): string {
  const d = new Date(isoStr);
  return String(d.getHours()).padStart(2, '0') + ':00';
}

export function formatSunTime(isoStr: string): string {
  const d = new Date(isoStr);
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

export function escapeHtml(str: string | null | undefined): string {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str == null ? '' : String(str)));
  return div.innerHTML;
}
