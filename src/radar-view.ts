// radar-view.ts — Radar map view: lazy Leaflet, RainViewer overlay, frame animation

import { state } from './state.js';
import { t } from './i18n.js';
import { fetchRadarFrames, formatRadarTime, type RadarFrame } from './radar.js';

type LeafletNS = typeof import('leaflet');
type LeafletMap = InstanceType<LeafletNS['Map']>;
type LeafletTileLayer = InstanceType<LeafletNS['TileLayer']>;

const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
const RADAR_ATTRIBUTION =
  'Radar &copy; <a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>';
const PLAY_INTERVAL_MS = 800;
const DEFAULT_ZOOM = 7;

let leaflet: LeafletNS | null = null;
let map: LeafletMap | null = null;
let overlay: LeafletTileLayer | null = null;
let frames: RadarFrame[] = [];
let frameIndex = 0;
let playTimer: ReturnType<typeof setInterval> | null = null;
let active = false;

function getMapContainer(): HTMLElement | null {
  return document.getElementById('radarMap');
}

function getStatus(): HTMLElement | null {
  return document.getElementById('radarStatus');
}

function getSlider(): HTMLInputElement | null {
  return document.getElementById('radarSlider') as HTMLInputElement | null;
}

function getFrameLabel(): HTMLElement | null {
  return document.getElementById('radarFrameLabel');
}

function getPlayBtn(): HTMLButtonElement | null {
  return document.getElementById('radarPlayBtn') as HTMLButtonElement | null;
}

function isPlaying(): boolean {
  return playTimer !== null;
}

function stopPlay(): void {
  if (playTimer !== null) {
    clearInterval(playTimer);
    playTimer = null;
  }
  const btn = getPlayBtn();
  if (btn) btn.textContent = t('radarPlay', state.lang);
}

function startPlay(): void {
  if (!map || playTimer !== null || frames.length < 2) return;
  const btn = getPlayBtn();
  if (btn) btn.textContent = t('radarPause', state.lang);
  playTimer = setInterval(() => {
    frameIndex = (frameIndex + 1) % frames.length;
    showFrame(frameIndex);
  }, PLAY_INTERVAL_MS);
}

function togglePlay(): void {
  if (isPlaying()) {
    stopPlay();
  } else {
    startPlay();
  }
}

function showFrame(index: number): void {
  if (!map || !leaflet || frames.length === 0) return;
  frameIndex = ((index % frames.length) + frames.length) % frames.length;

  if (overlay) overlay.remove();
  overlay = leaflet
    .tileLayer(frames[frameIndex].url, {
      opacity: 0.7,
      minZoom: 3,
      maxZoom: 16,
      attribution: RADAR_ATTRIBUTION,
    })
    .addTo(map);

  const slider = getSlider();
  if (slider) slider.value = String(frameIndex);

  const label = getFrameLabel();
  if (label) label.textContent = formatRadarTime(frames[frameIndex].time);
}

function showRadarError(): void {
  const status = getStatus();
  if (!status) return;
  status.hidden = false;
  status.textContent = '';
  const message = document.createElement('div');
  message.className = 'radar-status-message';
  message.textContent = t('radarError', state.lang);
  status.appendChild(message);
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'btn';
  retry.textContent = t('retry', state.lang);
  retry.addEventListener('click', () => {
    void openRadarMap();
  });
  status.appendChild(retry);
}

function showRadarLoading(): void {
  const status = getStatus();
  if (!status) return;
  status.hidden = false;
  status.textContent = t('radarLoading', state.lang);
}

function hideRadarStatus(): void {
  const status = getStatus();
  if (status) status.hidden = true;
}

/** Opens the radar map: lazy-loads Leaflet, fetches frames, builds the map. */
export async function openRadarMap(): Promise<void> {
  active = true;
  showRadarLoading();

  try {
    if (!leaflet) {
      await import('leaflet/dist/leaflet.css');
      leaflet = await import('leaflet');
    }
    if (!active) return;

    frames = await fetchRadarFrames();
    if (!active) return;
    if (frames.length === 0) throw new Error('empty_radar_frames');

    const container = getMapContainer();
    if (!container) return;

    hideRadarStatus();
    map = leaflet.map(container, {
      center: [state.lat, state.lon],
      zoom: DEFAULT_ZOOM,
    });
    leaflet.tileLayer(OSM_TILE_URL, {
      maxZoom: 19,
      attribution: OSM_ATTRIBUTION,
    }).addTo(map);

    const slider = getSlider();
    if (slider) {
      slider.max = String(frames.length - 1);
      slider.value = String(frames.length - 1);
    }

    frameIndex = frames.length - 1;
    showFrame(frameIndex);
    startPlay();

    // The panel was just unhidden; let Leaflet measure the now-visible container.
    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 100);
  } catch {
    if (active) showRadarError();
  }
}

/** Closes the radar map: stops playback and destroys the Leaflet instance. */
export function closeRadarMap(): void {
  active = false;
  stopPlay();
  overlay = null;
  frames = [];
  frameIndex = 0;
  if (map) {
    map.remove();
    map = null;
  }
  const slider = getSlider();
  if (slider) {
    slider.max = '0';
    slider.value = '0';
  }
  const label = getFrameLabel();
  if (label) label.textContent = '';
}

/** Re-centers an open map on the current state coordinates. */
export function recenterRadarMap(): void {
  if (map) map.setView([state.lat, state.lon], map.getZoom());
}

/** Re-applies translated labels to the radar panel and header button. */
export function applyRadarI18n(): void {
  const radarBtn = document.getElementById('radarBtn') as HTMLButtonElement | null;
  if (radarBtn) {
    radarBtn.textContent = t('radarLabel', state.lang);
    radarBtn.setAttribute('aria-label', t('radarAria', state.lang));
  }

  const title = document.getElementById('radarTitle');
  if (title) title.textContent = t('radarTitle', state.lang);

  const legend = document.getElementById('radarLegend');
  if (legend) legend.setAttribute('aria-label', t('radarLegendTitle', state.lang));

  const light = document.getElementById('radarLegendLight');
  if (light) light.textContent = t('radarLegendLight', state.lang);

  const heavy = document.getElementById('radarLegendHeavy');
  if (heavy) heavy.textContent = t('radarLegendHeavy', state.lang);

  const prev = document.getElementById('radarPrevBtn') as HTMLButtonElement | null;
  if (prev) {
    prev.textContent = t('radarPrev', state.lang);
    prev.setAttribute('aria-label', t('radarPrevAria', state.lang));
  }

  const next = document.getElementById('radarNextBtn') as HTMLButtonElement | null;
  if (next) {
    next.textContent = t('radarNext', state.lang);
    next.setAttribute('aria-label', t('radarNextAria', state.lang));
  }

  const slider = getSlider();
  if (slider) slider.setAttribute('aria-label', t('radarSliderAria', state.lang));

  const playBtn = getPlayBtn();
  if (playBtn) playBtn.textContent = t(isPlaying() ? 'radarPause' : 'radarPlay', state.lang);

  const status = getStatus();
  if (status && !status.hidden && status.childElementCount === 0) {
    status.textContent = t('radarLoading', state.lang);
  }
}

/** Wires the radar panel controls. Call once at startup. */
export function initRadarModule(): void {
  const prev = document.getElementById('radarPrevBtn') as HTMLButtonElement | null;
  prev?.addEventListener('click', () => {
    if (map) showFrame(frameIndex - 1);
  });

  const next = document.getElementById('radarNextBtn') as HTMLButtonElement | null;
  next?.addEventListener('click', () => {
    if (map) showFrame(frameIndex + 1);
  });

  const playBtn = getPlayBtn();
  playBtn?.addEventListener('click', togglePlay);

  const slider = getSlider();
  slider?.addEventListener('input', () => {
    if (map) showFrame(Number(slider.value));
  });
}