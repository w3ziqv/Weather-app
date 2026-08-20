// radar.ts — RainViewer radar data: pure parsing and URL building (no DOM)

import { fetchJsonWithTimeout } from './api.js';

export const RAINVIEWER_META_URL = 'https://api.rainviewer.com/public/weather-maps.json';

export const TILE_SIZE = 256;
export const TILE_COLOR = 4;
export const TILE_OPTIONS = '1_1';

const META_TIMEOUT_MS = 12000;

export interface RadarFrame {
  /** UNIX timestamp in seconds (UTC). */
  time: number;
  /** Leaflet tile URL template with {z}/{x}/{y} placeholders. */
  url: string;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Builds a concrete RainViewer radar tile URL for a given frame and tile coordinates. */
export function buildRadarTileUrl(
  host: string,
  path: string,
  z: number,
  x: number,
  y: number
): string {
  return (
    host +
    path +
    '/' +
    TILE_SIZE +
    '/' +
    z +
    '/' +
    x +
    '/' +
    y +
    '/' +
    TILE_COLOR +
    '/' +
    TILE_OPTIONS +
    '.png'
  );
}

/** Builds a Leaflet tile URL template (with {z}/{x}/{y} placeholders) for one radar frame. */
function buildRadarTileTemplate(host: string, path: string): string {
  return (
    host +
    path +
    '/' +
    TILE_SIZE +
    '/{z}/{x}/{y}/' +
    TILE_COLOR +
    '/' +
    TILE_OPTIONS +
    '.png'
  );
}

/**
 * Parses the RainViewer weather-maps.json payload into ordered, deduplicated radar
 * frames (past + nowcast). Each frame carries its own tile path. Returns an empty
 * array for invalid payloads.
 */
export function parseRadarFrames(data: unknown): RadarFrame[] {
  if (!isRecord(data)) return [];
  if (typeof data.host !== 'string') return [];
  const host = data.host;

  const seen = new Set<number>();
  const frames: RadarFrame[] = [];

  const collect = (list: unknown): void => {
    if (!Array.isArray(list)) return;
    for (const item of list) {
      if (!isRecord(item)) continue;
      const time = item.time;
      const path = item.path;
      if (typeof time === 'number' && typeof path === 'string' && !seen.has(time)) {
        seen.add(time);
        frames.push({ time, url: buildRadarTileTemplate(host, path) });
      }
    }
  };

  if (isRecord(data.radar)) {
    collect(data.radar.past);
    collect(data.radar.nowcast);
  }

  frames.sort((a, b) => a.time - b.time);
  return frames;
}

/**
 * Returns the next frame index in a cyclic sequence, wrapping in either
 * direction. `dir` is +1 for forward, -1 for backward. Returns 0 for an
 * empty frame set.
 */
export function nextFrameIndex(current: number, total: number, dir: 1 | -1): number {
  if (total <= 0) return 0;
  return (((current + dir) % total) + total) % total;
}

/** Formats a UNIX timestamp (seconds) as local HH:MM. */
export function formatRadarTime(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000);
  return (
    String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
  );
}

/** Fetches radar frames from the RainViewer public API. */
export function fetchRadarFrames(): Promise<RadarFrame[]> {
  return fetchJsonWithTimeout(RAINVIEWER_META_URL, META_TIMEOUT_MS).then(data =>
    parseRadarFrames(data)
  );
}
