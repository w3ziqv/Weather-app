// tests/utils.test.ts — Vitest unit tests for pure utility functions

import { describe, it, expect } from 'vitest';
import {
  toUnit,
  unitSymbol,
  aqiPercent,
  aqiDescription,
  sunProgress,
  shortDay,
  getCurrentHourIndex,
  formatHour,
  formatSunTime,
} from '../src/utils.js';

describe('toUnit', () => {
  it('converts 0C to 32F', () => {
    expect(toUnit(0, 'F')).toBe(32);
  });

  it('converts 100C to 212F', () => {
    expect(toUnit(100, 'F')).toBe(212);
  });

  it('converts -40C to -40F (the crossover point)', () => {
    expect(toUnit(-40, 'F')).toBe(-40);
  });

  it('rounds Celsius to integer in C mode', () => {
    expect(toUnit(22.6, 'C')).toBe(23);
  });

  it('rounds Celsius to integer in F mode', () => {
    expect(toUnit(22.6, 'F')).toBe(73);
  });

  it('handles negative temperatures in F', () => {
    expect(toUnit(-10, 'F')).toBe(14);
  });
});

describe('unitSymbol', () => {
  it('returns °C for C', () => {
    expect(unitSymbol('C')).toBe('\u00B0C');
  });

  it('returns °F for F', () => {
    expect(unitSymbol('F')).toBe('\u00B0F');
  });
});

describe('aqiPercent', () => {
  it('returns 0 for AQI 0', () => {
    expect(aqiPercent(0)).toBe(0);
  });

  it('returns correct percentage for AQI 75', () => {
    expect(aqiPercent(75)).toBe(50);
  });

  it('returns correct percentage for AQI 150', () => {
    expect(aqiPercent(150)).toBe(100);
  });

  it('caps at 100 for AQI above 150', () => {
    expect(aqiPercent(200)).toBe(100);
    expect(aqiPercent(500)).toBe(100);
  });
});

describe('aqiDescription', () => {
  it('returns "Bardzo dobra" for AQI 10 in Polish', () => {
    expect(aqiDescription(10, 'pl')).toBe('Bardzo dobra');
  });

  it('returns "Very good" for AQI 10 in English', () => {
    expect(aqiDescription(10, 'en')).toBe('Very good');
  });

  it('returns "Dobra" for AQI 30 in Polish', () => {
    expect(aqiDescription(30, 'pl')).toBe('Dobra');
  });

  it('returns "Umiarkowana" for AQI 50', () => {
    expect(aqiDescription(50, 'pl')).toBe('Umiarkowana');
  });

  it('returns "Zla" for AQI 70', () => {
    expect(aqiDescription(70, 'pl')).toBe('Zla');
  });

  it('returns "Bardzo zla" for AQI 90', () => {
    expect(aqiDescription(90, 'pl')).toBe('Bardzo zla');
  });

  it('returns "Niebezpieczna" for AQI above 100', () => {
    expect(aqiDescription(101, 'pl')).toBe('Niebezpieczna');
    expect(aqiDescription(200, 'pl')).toBe('Niebezpieczna');
  });
});

describe('sunProgress', () => {
  it('returns 0 before sunrise', () => {
    const now = new Date('2026-07-13T10:00:00');
    const rise = new Date('2026-07-13T11:00:00');
    const set = new Date('2026-07-13T20:00:00');
    expect(sunProgress(rise, set, now)).toBe(0);
  });

  it('returns 100 after sunset', () => {
    const now = new Date('2026-07-13T21:00:00');
    const rise = new Date('2026-07-13T05:00:00');
    const set = new Date('2026-07-13T20:00:00');
    expect(sunProgress(rise, set, now)).toBe(100);
  });

  it('returns 50 at the midpoint between sunrise and sunset', () => {
    const rise = new Date('2026-07-13T05:00:00');
    const set = new Date('2026-07-13T20:00:00');
    const mid = new Date('2026-07-13T12:30:00');
    expect(sunProgress(rise, set, mid)).toBe(50);
  });

  it('returns 0 when now equals sunrise', () => {
    const rise = new Date('2026-07-13T05:00:00');
    const set = new Date('2026-07-13T20:00:00');
    expect(sunProgress(rise, set, rise)).toBe(0);
  });

  it('returns 100 when now equals sunset', () => {
    const rise = new Date('2026-07-13T05:00:00');
    const set = new Date('2026-07-13T20:00:00');
    expect(sunProgress(rise, set, set)).toBe(100);
  });
});

describe('shortDay', () => {
  it('returns English weekday abbreviations', () => {
    expect(shortDay('2026-07-13', 'en')).toBe('Mon');
    expect(shortDay('2026-07-14', 'en')).toBe('Tue');
    expect(shortDay('2026-07-12', 'en')).toBe('Sun');
  });

  it('returns Polish weekday abbreviations', () => {
    expect(shortDay('2026-07-13', 'pl')).toBe('Pon');
    expect(shortDay('2026-07-14', 'pl')).toBe('Wt');
    expect(shortDay('2026-07-12', 'pl')).toBe('Ndz');
  });
});

describe('formatHour', () => {
  it('formats an ISO string as HH:00', () => {
    expect(formatHour('2026-07-13T14:00:00')).toBe('14:00');
    expect(formatHour('2026-07-13T09:00:00')).toBe('09:00');
    expect(formatHour('2026-07-13T00:00:00')).toBe('00:00');
  });
});

describe('formatSunTime', () => {
  it('formats an ISO string as HH:MM', () => {
    expect(formatSunTime('2026-07-13T05:30:00')).toBe('05:30');
    expect(formatSunTime('2026-07-13T20:15:00')).toBe('20:15');
    expect(formatSunTime('2026-07-13T00:00:00')).toBe('00:00');
  });
});

describe('getCurrentHourIndex', () => {
  it('returns the index closest to the current time', () => {
    const times = [
      '2026-07-13T10:00:00',
      '2026-07-13T11:00:00',
      '2026-07-13T12:00:00',
      '2026-07-13T13:00:00',
    ];
    const now = new Date('2026-07-13T12:30:00');
    expect(getCurrentHourIndex(times, now)).toBe(2);
  });

  it('returns 0 when now is before all times', () => {
    const times = ['2026-07-13T10:00:00', '2026-07-13T11:00:00'];
    const now = new Date('2026-07-13T08:00:00');
    expect(getCurrentHourIndex(times, now)).toBe(0);
  });

  it('returns last index when now is after all times', () => {
    const times = ['2026-07-13T10:00:00', '2026-07-13T11:00:00'];
    const now = new Date('2026-07-13T15:00:00');
    expect(getCurrentHourIndex(times, now)).toBe(1);
  });

  it('returns exact match index', () => {
    const times = ['2026-07-13T10:00:00', '2026-07-13T11:00:00', '2026-07-13T12:00:00'];
    const now = new Date('2026-07-13T11:00:00');
    expect(getCurrentHourIndex(times, now)).toBe(1);
  });
});
