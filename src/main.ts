// main.ts — Application entry point, event listeners, autocomplete

import { state, persistState, saveTheme, applySavedTheme } from './state.js';
import { t, type Lang } from './i18n.js';
import { toUnit, aqiPercent, sunProgress } from './utils.js';
import { fetchAll, buildGeocodingUrl, type GeocodingResult } from './api.js';
import { showLoading, showError, render, announce, runRenderBenchmark } from './render.js';
import {
  initRadarModule,
  openRadarMap,
  closeRadarMap,
  recenterRadarMap,
  applyRadarI18n,
} from './radar-view.js';

const DEBUG_MODE = new URLSearchParams(window.location.search).has('debug');

const appEl = document.getElementById('app') as HTMLElement | null;
const langBtn = document.getElementById('langBtn') as HTMLButtonElement | null;
const themeBtn = document.getElementById('themeBtn') as HTMLButtonElement | null;
const unitBtn = document.getElementById('unitBtn') as HTMLButtonElement | null;
const geoBtn = document.getElementById('geoBtn') as HTMLButtonElement | null;
const radarBtn = document.getElementById('radarBtn') as HTMLButtonElement | null;
const viewMap = document.getElementById('viewMap') as HTMLElement | null;
const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
const autocompleteEl = document.getElementById('autocomplete') as HTMLElement | null;
const srStatus = document.getElementById('srStatus') as HTMLElement | null;

let autocompleteResults: GeocodingResult[] = [];
let debugBenchDone = false;

if (themeBtn) applySavedTheme(themeBtn);
applyLanguageToStaticUi();
if (unitBtn) {
  unitBtn.textContent = '\u00B0' + state.unit;
  unitBtn.setAttribute('aria-pressed', String(state.unit === 'F'));
}

function handleFetchAll(): void {
  if (!appEl) return;
  showLoading(appEl);

  fetchAll(state)
    .then(([weather, aqi]) => {
      state.weather = weather;
      state.aqi = aqi;
      persistState(state);
      render(appEl, srStatus);
      if (DEBUG_MODE && !debugBenchDone) {
        debugBenchDone = true;
        setTimeout(() => {
          runRenderBenchmark(appEl, srStatus, 10);
        }, 0);
      }
    })
    .catch((error: unknown) => {
      if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'AbortError') {
        showError(appEl, t('timeoutError', state.lang), true, handleFetchAll);
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        showError(appEl, t('offlineError', state.lang), true, handleFetchAll);
        return;
      }

      showError(appEl, t('weatherFetchFailed', state.lang), true, handleFetchAll);
    });
}

function applyLanguageToStaticUi(): void {
  const html = document.documentElement;
  html.lang = state.lang;
  document.title = t('appTitle', state.lang);

  const logo = document.querySelector('.logo');
  if (logo) logo.textContent = t('logo', state.lang);

  const controlsNav = document.querySelector('.header-controls');
  if (controlsNav) controlsNav.setAttribute('aria-label', t('controlsNav', state.lang));

  const searchLabel = document.querySelector('label[for="searchInput"]');
  if (searchLabel) searchLabel.textContent = t('searchLabel', state.lang);

  if (searchInput) {
    searchInput.placeholder = t('searchPlaceholder', state.lang);
    searchInput.setAttribute('aria-label', t('searchLabel', state.lang));
  }
  if (autocompleteEl) autocompleteEl.setAttribute('aria-label', t('searchSuggestions', state.lang));

  if (langBtn) {
    langBtn.textContent = state.lang.toUpperCase();
    langBtn.setAttribute('aria-label', t('languageSwitch', state.lang));
  }

  if (geoBtn) {
    geoBtn.textContent = t('locationLabel', state.lang);
    geoBtn.setAttribute('aria-label', t('locationAria', state.lang));
  }

  if (unitBtn) unitBtn.setAttribute('aria-label', t('unitAria', state.lang));

  if (themeBtn) {
    themeBtn.textContent = t('themeLabel', state.lang);
    themeBtn.setAttribute('aria-label', t('themeAria', state.lang));
  }

  if (radarBtn) {
    radarBtn.textContent = t('radarLabel', state.lang);
    radarBtn.setAttribute('aria-label', t('radarAria', state.lang));
  }

  applyRadarI18n();

  const footerText = document.querySelector('.footer-text');
  if (footerText) footerText.textContent = t('footerText', state.lang);
}

langBtn?.addEventListener('click', () => {
  const prevLang: Lang = state.lang;
  state.lang = state.lang === 'pl' ? 'en' : 'pl';

  if (state.cityName === t('myLocation', prevLang)) {
    state.cityName = t('myLocation', state.lang);
  }

  persistState(state);
  applyLanguageToStaticUi();
  if (appEl) {
    if (state.weather) {
      render(appEl, srStatus);
    } else {
      showLoading(appEl);
    }
  }
});

themeBtn?.addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'light';
  const next: 'light' | 'dark' = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  if (themeBtn) themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
  saveTheme(next);
});

unitBtn?.addEventListener('click', () => {
  state.unit = state.unit === 'C' ? 'F' : 'C';
  unitBtn.textContent = '\u00B0' + state.unit;
  unitBtn.setAttribute('aria-pressed', String(state.unit === 'F'));
  persistState(state);
  if (appEl && state.weather) render(appEl, srStatus);
});

geoBtn?.addEventListener('click', () => {
  if (!appEl) return;
  if (!navigator.geolocation) {
    showError(appEl, t('browserNoGeo', state.lang), false, () => {});
    return;
  }

  geoBtn.textContent = '...';
  geoBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    pos => {
      state.lat = Math.round(pos.coords.latitude * 100) / 100;
      state.lon = Math.round(pos.coords.longitude * 100) / 100;
      state.cityName = t('myLocation', state.lang);
      persistState(state);
      resetGeoButton();
      handleFetchAll();
      recenterRadarMap();
    },
    () => {
      resetGeoButton();
      if (appEl) showError(appEl, t('locationFetchFailed', state.lang), false, () => {});
    },
    { timeout: 10000 }
  );
});

function resetGeoButton(): void {
  if (!geoBtn) return;
  geoBtn.textContent = t('locationLabel', state.lang);
  geoBtn.disabled = false;
}

radarBtn?.addEventListener('click', () => {
  if (!viewMap) return;
  const opening = viewMap.hidden;
  viewMap.hidden = !opening;
  if (radarBtn) {
    radarBtn.setAttribute('aria-pressed', String(opening));
    radarBtn.setAttribute('aria-expanded', String(opening));
  }
  if (opening) {
    void openRadarMap();
  } else {
    closeRadarMap();
  }
});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let acIndex = -1;

searchInput?.addEventListener('input', () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  if (!searchInput || !autocompleteEl) return;
  const q = searchInput.value.trim();

  if (q.length < 2) {
    closeAutocomplete();
    return;
  }

  searchTimeout = setTimeout(() => {
    const url = buildGeocodingUrl(q, state.lang);

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('geocoding_failed');
        return r.json() as Promise<{ results?: GeocodingResult[] }>;
      })
      .then(data => {
        if (!data.results || !data.results.length) {
          closeAutocomplete();
          return;
        }

        autocompleteResults = data.results;
        autocompleteEl.innerHTML = '';
        autocompleteResults.forEach((r, i) => {
          const div = document.createElement('div');
          div.className = 'autocomplete-item';
          div.id = 'city-option-' + i;
          div.dataset.index = String(i);
          div.setAttribute('role', 'option');
          div.setAttribute('aria-selected', 'false');
          div.textContent = r.name + (r.admin1 ? ', ' + r.admin1 : '') + (r.country ? ' - ' + r.country : '');
          autocompleteEl.appendChild(div);
        });

        autocompleteEl.classList.add('active');
        searchInput.setAttribute('aria-expanded', 'true');
        announce(srStatus, t('searchResultsReady', state.lang));
      })
      .catch(() => {
        closeAutocomplete();
      });
  }, 300);
});

autocompleteEl?.addEventListener('click', e => {
  const target = e.target as HTMLElement;
  const optionEl = target.closest('.autocomplete-item') as HTMLElement | null;
  if (!optionEl) return;

  const idx = Number(optionEl.dataset.index);
  if (!Number.isInteger(idx) || !autocompleteResults[idx]) return;

  const result = autocompleteResults[idx];
  state.lat = result.latitude;
  state.lon = result.longitude;
  state.cityName = result.name;
  if (searchInput) searchInput.value = '';
  persistState(state);
  closeAutocomplete();
  handleFetchAll();
  recenterRadarMap();
});

document.addEventListener('click', e => {
  if (!autocompleteEl || !searchInput) return;
  if (!autocompleteEl.contains(e.target as Node) && e.target !== searchInput) {
    closeAutocomplete();
  }
});

searchInput?.addEventListener('keydown', e => {
  if (!autocompleteEl) return;
  const items = autocompleteEl.querySelectorAll('.autocomplete-item');
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    acIndex = Math.min(acIndex + 1, items.length - 1);
    syncAutocompleteActive(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    acIndex = Math.max(acIndex - 1, 0);
    syncAutocompleteActive(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const item = items[acIndex] as HTMLElement | undefined;
    if (item) item.click();
  } else if (e.key === 'Escape') {
    closeAutocomplete();
  }
});

const acObserver = new MutationObserver(() => {
  acIndex = -1;
  if (searchInput) searchInput.removeAttribute('aria-activedescendant');
});
if (autocompleteEl) acObserver.observe(autocompleteEl, { childList: true });

window.addEventListener('beforeunload', () => {
  acObserver.disconnect();
});

function syncAutocompleteActive(items: NodeListOf<Element>): void {
  items.forEach((it, i) => {
    const el = it as HTMLElement;
    const isActive = i === acIndex;
    el.classList.toggle('active', isActive);
    el.setAttribute('aria-selected', String(isActive));
    if (isActive && searchInput) {
      searchInput.setAttribute('aria-activedescendant', el.id);
    }
  });
}

function closeAutocomplete(): void {
  if (!autocompleteEl || !searchInput) return;
  autocompleteEl.classList.remove('active');
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.removeAttribute('aria-activedescendant');
  autocompleteResults = [];
  acIndex = -1;
}

interface SelfTestResult {
  name: string;
  ok: boolean;
  message?: string;
}

function runSelfTests(): { passed: number; failed: number; total: number } {
  const results: SelfTestResult[] = [];

  function test(name: string, fn: () => void): void {
    try {
      fn();
      results.push({ name, ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({ name, ok: false, message });
    }
  }

  test('toUnit converts 0C to 32F', () => {
    if (toUnit(0, 'F') !== 32) throw new Error('Expected 32');
  });

  test('toUnit converts 100C to 212F', () => {
    if (toUnit(100, 'F') !== 212) throw new Error('Expected 212');
  });

  test('toUnit rounds Celsius to integer', () => {
    if (toUnit(22.6, 'C') !== 23) throw new Error('Expected 23');
  });

  test('aqiPercent caps at 100', () => {
    if (aqiPercent(200) !== 100) throw new Error('Expected 100');
  });

  test('aqiPercent returns 0 for 0', () => {
    if (aqiPercent(0) !== 0) throw new Error('Expected 0');
  });

  test('sunProgress returns 0 before sunrise', () => {
    const rise = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const set = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    if (sunProgress(rise, set) !== 0) throw new Error('Expected 0');
  });

  test('sunProgress returns 100 after sunset', () => {
    const rise = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const set = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    if (sunProgress(rise, set) !== 100) throw new Error('Expected 100');
  });

  const passed = results.filter(r => r.ok).length;
  const failed = results.length - passed;
  console.groupCollapsed('[debug] Self-tests: ' + passed + '/' + results.length + ' passed');
  results.forEach(r => {
    if (r.ok) {
      console.log('PASS - ' + r.name);
    } else {
      console.error('FAIL - ' + r.name + ' - ' + (r.message || ''));
    }
  });
  console.groupEnd();

  return { passed, failed, total: results.length };
}

if (DEBUG_MODE) {
  runSelfTests();
}

initRadarModule();
handleFetchAll();
