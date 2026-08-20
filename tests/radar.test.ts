// tests/radar.test.ts — Vitest unit tests for RainViewer radar helpers

import { describe, it, expect } from 'vitest';
import {
  buildRadarTileUrl,
  parseRadarFrames,
  formatRadarTime,
  TILE_SIZE,
  TILE_COLOR,
  TILE_OPTIONS,
} from '../src/radar.js';

describe('buildRadarTileUrl', () => {
  it('builds a RainViewer tile URL with size, color and options', () => {
    const url = buildRadarTileUrl('https://tilecache.rainviewer.com', '/v2/radar/123', 7, 42, 17);
    expect(url).toBe(
      'https://tilecache.rainviewer.com/v2/radar/123/' +
        TILE_SIZE +
        '/7/42/17/' +
        TILE_COLOR +
        '/' +
        TILE_OPTIONS +
        '.png'
    );
  });

  it('uses the configured size, color and options constants', () => {
    expect(TILE_SIZE).toBe(256);
    expect(TILE_COLOR).toBe(4);
    expect(TILE_OPTIONS).toBe('1_1');
  });
});

describe('parseRadarFrames', () => {
  const payload = {
    host: 'https://tilecache.rainviewer.com',
    radar: {
      past: [
        { time: 100, path: '/v2/radar/aaa' },
        { time: 200, path: '/v2/radar/bbb' },
        { time: 300, path: '/v2/radar/ccc' },
      ],
      nowcast: [
        { time: 300, path: '/v2/radar/ccc' },
        { time: 400, path: '/v2/radar/ddd' },
      ],
    },
  };

  it('combines past and nowcast frames in ascending time order', () => {
    const frames = parseRadarFrames(payload);
    expect(frames.map(f => f.time)).toEqual([100, 200, 300, 400]);
  });

  it('deduplicates timestamps shared between past and nowcast', () => {
    const frames = parseRadarFrames(payload);
    expect(frames).toHaveLength(4);
  });

  it('builds a Leaflet tile URL template with {z}/{x}/{y} placeholders per frame', () => {
    const frames = parseRadarFrames(payload);
    expect(frames[0].url).toBe(
      'https://tilecache.rainviewer.com/v2/radar/aaa/' +
        TILE_SIZE +
        '/{z}/{x}/{y}/' +
        TILE_COLOR +
        '/' +
        TILE_OPTIONS +
        '.png'
    );
    expect(frames[3].url).toBe(
      'https://tilecache.rainviewer.com/v2/radar/ddd/' +
        TILE_SIZE +
        '/{z}/{x}/{y}/' +
        TILE_COLOR +
        '/' +
        TILE_OPTIONS +
        '.png'
    );
  });

  it('returns an empty array for invalid payloads', () => {
    expect(parseRadarFrames(null)).toEqual([]);
    expect(parseRadarFrames('nope')).toEqual([]);
    expect(parseRadarFrames({})).toEqual([]);
    expect(parseRadarFrames({ host: 'h' })).toEqual([]);
    expect(parseRadarFrames({ host: 'h', radar: { past: 'x' } })).toEqual([]);
  });

  it('ignores entries without a numeric time or a path', () => {
    const frames = parseRadarFrames({
      host: 'h',
      radar: {
        past: [
          { time: 100, path: '/p' },
          { time: 'bad', path: '/p' },
          { time: 200 },
          {},
        ],
      },
    });
    expect(frames.map(f => f.time)).toEqual([100]);
  });
});

describe('formatRadarTime', () => {
  it('formats a UNIX timestamp as local HH:MM', () => {
    const local = new Date(2026, 6, 13, 14, 30);
    expect(formatRadarTime(local.getTime() / 1000)).toBe('14:30');
  });

  it('pads single-digit hours and minutes', () => {
    const local = new Date(2026, 6, 13, 9, 5);
    expect(formatRadarTime(local.getTime() / 1000)).toBe('09:05');
  });

  it('handles midnight', () => {
    const local = new Date(2026, 6, 13, 0, 0);
    expect(formatRadarTime(local.getTime() / 1000)).toBe('00:00');
  });
});