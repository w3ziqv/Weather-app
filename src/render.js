// render.js — DOM rendering functions

import { state } from './state.js';
import { t } from './i18n.js';
import { weatherInfo } from './icons.js';
import {
  toUnit, unitSymbol, aqiPercent, aqiDescription,
  sunProgress, shortDay, getCurrentHourIndex,
  formatHour, formatSunTime, escapeHtml
} from './utils.js';

let hourlyScrollLeft = 0;

export function setHourlyScrollLeft(val) {
  hourlyScrollLeft = val;
}

export function createEl(tagName, className, text) {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  if (text != null) el.textContent = String(text);
  return el;
}

function createStatItem(label, value) {
  const item = createEl('div', 'stat-item');
  item.appendChild(createEl('div', 'label', label));
  item.appendChild(createEl('div', 'stat-value', value));
  return item;
}

function createWeatherIcon(className, iconFn) {
  const iconEl = createEl('div', className);
  iconEl.setAttribute('aria-hidden', 'true');
  iconEl.innerHTML = iconFn();
  return iconEl;
}

function createCurrentWeatherCard(cw, info, dateStr) {
  const card = createEl('div', 'card col-6 current-weather');

  const top = createEl('div');
  top.appendChild(createEl('h1', 'city-name', state.cityName));
  top.appendChild(createEl('div', 'date-time', dateStr));

  const tempRow = createEl('div', 'temp-row');
  const bigNumber = createEl('div', 'big-number', toUnit(cw.temperature, state.unit));
  bigNumber.appendChild(createEl('span', 'temp-unit', unitSymbol(state.unit)));
  tempRow.appendChild(bigNumber);
  tempRow.appendChild(createWeatherIcon('weather-icon', info.icon));

  card.appendChild(top);
  card.appendChild(tempRow);
  card.appendChild(createEl('div', 'description', info.desc));
  return card;
}

function createStatsCard(data) {
  const card = createEl('div', 'card col-6');
  card.appendChild(createEl('div', 'label', t('stats', state.lang)));

  const statsGrid = createEl('div', 'stats-grid');
  statsGrid.appendChild(createStatItem(t('wind', state.lang), data.windSpeed + ' km/h'));
  statsGrid.appendChild(createStatItem(t('humidity', state.lang), data.humidity + '%'));
  statsGrid.appendChild(createStatItem(t('pressure', state.lang), data.pressure + ' hPa'));
  statsGrid.appendChild(createStatItem(t('uv', state.lang), data.uvIndex));
  statsGrid.appendChild(createStatItem(t('visibility', state.lang), data.visibility + ' km'));
  statsGrid.appendChild(createStatItem(t('cloudiness', state.lang), data.cloudiness));
  card.appendChild(statsGrid);

  const sunWrap = createEl('div', 'sun-wrap');
  sunWrap.appendChild(createEl('div', 'label', t('sunriseSunset', state.lang)));

  const sunTimes = createEl('div', 'sun-times');

  const sunriseCol = createEl('div');
  sunriseCol.appendChild(createEl('div', 'label', t('sunrise', state.lang)));
  sunriseCol.appendChild(createEl('div', 'sun-time-value', formatSunTime(data.sunrise)));

  const sunsetCol = createEl('div', 'sun-time-end');
  sunsetCol.appendChild(createEl('div', 'label', t('sunset', state.lang)));
  sunsetCol.appendChild(createEl('div', 'sun-time-value', formatSunTime(data.sunset)));

  sunTimes.appendChild(sunriseCol);
  sunTimes.appendChild(sunsetCol);

  const progressTrack = createEl('div', 'sun-progress-track');
  progressTrack.appendChild(createEl('div', 'sun-progress-bar'));
  progressTrack.lastChild.id = 'sunBar';
  progressTrack.appendChild(createEl('div', 'sun-progress-dot'));
  progressTrack.lastChild.id = 'sunDot';

  sunWrap.appendChild(sunTimes);
  sunWrap.appendChild(progressTrack);
  card.appendChild(sunWrap);

  return card;
}

function createHourlySection(w, hourIdx) {
  const section = createEl('section', 'card col-12');
  section.setAttribute('aria-label', t('hourlyAria', state.lang));
  section.appendChild(createEl('div', 'label', t('hourly24h', state.lang)));

  const scroll = createEl('div', 'hourly-scroll');
  for (let i = 0; i < 24; i += 2) {
    const idx = hourIdx + i;
    if (idx >= w.hourly.time.length) break;

    const hCode = w.hourly.weathercode ? w.hourly.weathercode[idx] : guessHourWeatherCode(w, idx);
    const hInfo = weatherInfo(hCode, state.lang);

    const item = createEl('div', 'hourly-item');
    item.appendChild(createEl('div', 'hourly-time', formatHour(w.hourly.time[idx])));
    item.appendChild(createWeatherIcon('hourly-icon', hInfo.icon));
    item.appendChild(createEl('div', 'hourly-temp', toUnit(w.hourly.temperature_2m[idx], state.unit) + '\u00B0'));
    item.appendChild(createEl('div', 'hourly-precip', (w.hourly.precipitation_probability[idx] || 0) + '%'));
    scroll.appendChild(item);
  }

  scroll.scrollLeft = hourlyScrollLeft;
  scroll.addEventListener('scroll', () => {
    hourlyScrollLeft = scroll.scrollLeft;
  }, { passive: true });

  section.appendChild(scroll);
  return section;
}

function createChartSection(w, hourIdx) {
  const section = createEl('section', 'card col-12');
  section.setAttribute('aria-label', t('tempChartAria', state.lang));
  section.appendChild(createEl('div', 'label', t('tempChart24h', state.lang)));

  const container = createEl('div', 'chart-container');
  container.innerHTML = buildTempChart(w.hourly.time, w.hourly.temperature_2m, hourIdx);
  section.appendChild(container);
  return section;
}

function createForecastSection(w) {
  const section = createEl('section', 'card col-8');
  section.setAttribute('aria-label', t('forecast7dAria', state.lang));
  section.appendChild(createEl('div', 'label', t('forecast7d', state.lang)));

  const table = createEl('table', 'forecast-table');
  const thead = createEl('thead');
  const headRow = createEl('tr');

  const headers = [t('day', state.lang), t('max', state.lang), t('min', state.lang), t('precipitation', state.lang)];
  headers.forEach(header => {
    const th = createEl('th', null, header);
    th.scope = 'col';
    headRow.appendChild(th);
  });

  const iconTh = createEl('th');
  iconTh.scope = 'col';
  iconTh.appendChild(createEl('span', 'visually-hidden', t('weatherIcon', state.lang)));
  headRow.appendChild(iconTh);

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = createEl('tbody');
  for (let i = 0; i < w.daily.time.length; i++) {
    const dInfo = weatherInfo(w.daily.weathercode[i], state.lang);
    const dn = i === 0 ? t('today', state.lang) : shortDay(w.daily.time[i], state.lang);

    const row = createEl('tr');
    row.appendChild(createEl('td', 'day-name', dn));
    row.appendChild(createEl('td', 'temp-max', toUnit(w.daily.temperature_2m_max[i], state.unit) + '\u00B0'));
    row.appendChild(createEl('td', 'temp-min', toUnit(w.daily.temperature_2m_min[i], state.unit) + '\u00B0'));
    row.appendChild(createEl('td', null, (w.daily.precipitation_sum[i] || 0) + ' mm'));

    const iconCell = createEl('td');
    iconCell.setAttribute('aria-hidden', 'true');
    iconCell.innerHTML = dInfo.icon();
    row.appendChild(iconCell);

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  section.appendChild(table);
  return section;
}

function createAqiSection(aqiVal) {
  const section = createEl('section', 'card col-4');
  section.setAttribute('aria-label', t('airQualityAria', state.lang));

  section.appendChild(createEl('div', 'label', t('airQuality', state.lang)));
  section.appendChild(createEl('div', 'aqi-value', aqiVal));
  section.appendChild(createEl('div', 'aqi-desc', typeof aqiVal === 'number' ? aqiDescription(aqiVal, state.lang) : t('noAqiData', state.lang)));

  const barTrack = createEl('div', 'aqi-bar-track');
  const barFill = createEl('div', 'aqi-bar-fill');
  barFill.id = 'aqiBar';
  barTrack.appendChild(barFill);
  section.appendChild(barTrack);

  const noteWrap = createEl('div', 'aqi-note');
  noteWrap.appendChild(createEl('span', 'label', t('europeanAqi', state.lang)));
  section.appendChild(noteWrap);

  return section;
}

function buildTempChart(hourlyTimes, hourlyTemps, startIdx) {
  const count = 24;
  const temps = [];
  const labels = [];

  for (let i = 0; i < count; i += 2) {
    const idx = startIdx + i;
    if (idx < hourlyTemps.length) {
      temps.push(toUnit(hourlyTemps[idx], state.unit));
      labels.push(formatHour(hourlyTimes[idx]));
    }
  }

  if (temps.length === 0) return '';

  const w = 700;
  const h = 180;
  const padTop = 30;
  const padBot = 30;
  const padLeft = 10;
  const padRight = 10;
  const minT = Math.min(...temps) - 2;
  const maxT = Math.max(...temps) + 2;
  const rangeT = maxT - minT || 1;
  const stepX = (w - padLeft - padRight) / (temps.length - 1 || 1);

  const points = temps.map((temp, i) => {
    const x = padLeft + i * stepX;
    const y = padTop + (1 - (temp - minT) / rangeT) * (h - padTop - padBot);
    return { x, y, temp, label: labels[i] };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1))
    .join(' ');

  let svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + t('tempChartSvgAria', state.lang) + '">';

  for (let i = 0; i <= 4; i++) {
    const y = padTop + (i / 4) * (h - padTop - padBot);
    svg += '<line x1="' + padLeft + '" y1="' + y.toFixed(1) + '" x2="' + (w - padRight) + '" y2="' + y.toFixed(1) + '" class="chart-grid-line"/>';
  }

  svg += '<path d="' + pathD + '" class="chart-line"/>';

  points.forEach(p => {
    svg += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="3.5" class="chart-dot"/>';
    svg += '<text x="' + p.x.toFixed(1) + '" y="' + (p.y - 10).toFixed(1) + '" class="chart-value-label">' + p.temp + '&#176;</text>';
    svg += '<text x="' + p.x.toFixed(1) + '" y="' + (h - 6) + '" class="chart-label">' + p.label + '</text>';
  });

  svg += '</svg>';
  return svg;
}

function guessHourWeatherCode(w, idx) {
  if (!w.daily || !w.daily.weathercode) return 0;

  const hourTime = new Date(w.hourly.time[idx]);
  const dayIdx = w.daily.time.findIndex(d => {
    const dd = new Date(d + 'T00:00:00');
    return dd.toDateString() === hourTime.toDateString();
  });

  return dayIdx >= 0 ? w.daily.weathercode[dayIdx] : 0;
}

export function showLoading(appEl) {
  const fragment = document.createDocumentFragment();

  const status = createEl('div', 'loading-text col-12', t('loadingData', state.lang));
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  fragment.appendChild(status);

  const cardA = createEl('div', 'skeleton-card col-6 skeleton-h-280');
  const rowA = createEl('div', 'skeleton-row');
  rowA.appendChild(createEl('div', 'skeleton-line skeleton-line--md'));
  rowA.appendChild(createEl('div', 'skeleton-line skeleton-line--lg'));
  rowA.appendChild(createEl('div', 'skeleton-spacer-24'));
  rowA.appendChild(createEl('div', 'skeleton-line'));
  cardA.appendChild(rowA);

  const cardB = createEl('div', 'skeleton-card col-6 skeleton-h-280');
  const rowB = createEl('div', 'skeleton-row');
  rowB.appendChild(createEl('div', 'skeleton-line skeleton-line--md'));
  rowB.appendChild(createEl('div', 'skeleton-line'));
  rowB.appendChild(createEl('div', 'skeleton-line'));
  rowB.appendChild(createEl('div', 'skeleton-line'));
  cardB.appendChild(rowB);

  const cardC = createEl('div', 'skeleton-card col-12 skeleton-h-170');
  const rowC = createEl('div', 'skeleton-row');
  rowC.appendChild(createEl('div', 'skeleton-line skeleton-line--md'));
  rowC.appendChild(createEl('div', 'skeleton-line'));
  cardC.appendChild(rowC);

  const cardD = createEl('div', 'skeleton-card col-12 skeleton-h-210');
  const rowD = createEl('div', 'skeleton-row');
  rowD.appendChild(createEl('div', 'skeleton-line skeleton-line--md'));
  rowD.appendChild(createEl('div', 'skeleton-line'));
  cardD.appendChild(rowD);

  const cardE = createEl('div', 'skeleton-card col-8 skeleton-h-210');
  const rowE = createEl('div', 'skeleton-row');
  rowE.appendChild(createEl('div', 'skeleton-line skeleton-line--md'));
  rowE.appendChild(createEl('div', 'skeleton-line'));
  rowE.appendChild(createEl('div', 'skeleton-line'));
  cardE.appendChild(rowE);

  const cardF = createEl('div', 'skeleton-card col-4 skeleton-h-210');
  const rowF = createEl('div', 'skeleton-row');
  rowF.appendChild(createEl('div', 'skeleton-line skeleton-line--md'));
  rowF.appendChild(createEl('div', 'skeleton-line skeleton-line--lg'));
  cardF.appendChild(rowF);

  fragment.appendChild(cardA);
  fragment.appendChild(cardB);
  fragment.appendChild(cardC);
  fragment.appendChild(cardD);
  fragment.appendChild(cardE);
  fragment.appendChild(cardF);

  appEl.replaceChildren(fragment);
}

export function showError(appEl, message, canRetry, onRetry) {
  let html = '<div class="card col-12 error-box" role="alert">';
  html += '<div class="label">' + t('errorTitle', state.lang) + '</div>';
  html += '<p class="error-message">' + escapeHtml(message) + '</p>';
  if (canRetry) {
    html += '<button class="btn" id="retryBtn" type="button">' + t('retry', state.lang) + '</button>';
  }
  html += '</div>';

  appEl.innerHTML = html;

  if (canRetry) {
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', onRetry);
      retryBtn.focus();
    }
  }
}

export function announce(srStatus, message) {
  if (!srStatus) return;
  srStatus.textContent = '';
  requestAnimationFrame(() => {
    srStatus.textContent = message;
  });
}

export function render(appEl, srStatus, options) {
  const renderOptions = options || {};
  const silent = renderOptions.silent === true;
  const w = state.weather;
  const a = state.aqi;
  if (!w) return;

  const cw = w.current_weather;
  const info = weatherInfo(cw.weathercode, state.lang);
  const hourIdx = getCurrentHourIndex(w.hourly.time);

  const humidity = w.hourly.relativehumidity_2m ? w.hourly.relativehumidity_2m[hourIdx] : '--';
  const uvIndex = w.hourly.uv_index ? w.hourly.uv_index[hourIdx] : '--';
  const visibility = w.hourly.visibility ? (w.hourly.visibility[hourIdx] / 1000).toFixed(1) : '--';
  const pressure = w.hourly.surface_pressure ? Math.round(w.hourly.surface_pressure[hourIdx]) : '--';
  const windSpeed = cw.windspeed;

  let aqiVal = '--';
  if (a && a.current && a.current.european_aqi != null) {
    aqiVal = a.current.european_aqi;
  } else if (a && a.hourly && a.hourly.european_aqi) {
    const aqiIdx = getCurrentHourIndex(a.hourly.time);
    aqiVal = a.hourly.european_aqi[aqiIdx];
  }
  const aqiNum = typeof aqiVal === 'number' ? aqiVal : 0;

  const sunrise = w.daily.sunrise[0];
  const sunset = w.daily.sunset[0];
  const sunProg = sunProgress(sunrise, sunset);

  const now = new Date();
  const dateStr = now.toLocaleDateString(state.lang === 'en' ? 'en-US' : 'pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const fragment = document.createDocumentFragment();
  fragment.appendChild(createCurrentWeatherCard(cw, info, dateStr));
  fragment.appendChild(createStatsCard({
    windSpeed,
    humidity,
    pressure,
    uvIndex,
    visibility,
    cloudiness: info.desc,
    sunrise,
    sunset
  }));
  fragment.appendChild(createHourlySection(w, hourIdx));
  fragment.appendChild(createChartSection(w, hourIdx));
  fragment.appendChild(createForecastSection(w));
  fragment.appendChild(createAqiSection(aqiVal));

  appEl.replaceChildren(fragment);

  requestAnimationFrame(() => {
    const sunBar = document.getElementById('sunBar');
    const sunDot = document.getElementById('sunDot');
    if (sunBar) sunBar.style.width = sunProg + '%';
    if (sunDot) sunDot.style.left = sunProg + '%';
    const aqiBar = document.getElementById('aqiBar');
    if (aqiBar) aqiBar.style.width = aqiPercent(aqiNum) + '%';
  });

  if (!silent) {
    announce(srStatus, t('weatherUpdated', state.lang, { city: state.cityName }));
  }
}

export function runRenderBenchmark(appEl, srStatus, iterations) {
  const count = Number.isInteger(iterations) && iterations > 0 ? iterations : 8;
  const times = [];

  for (let i = 0; i < count; i++) {
    const start = performance.now();
    render(appEl, srStatus, { silent: true });
    times.push(performance.now() - start);
  }

  const total = times.reduce((sum, value) => sum + value, 0);
  const avg = total / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.info('[debug] Render benchmark (' + count + ' runs): avg=' + avg.toFixed(2) + 'ms, min=' + min.toFixed(2) + 'ms, max=' + max.toFixed(2) + 'ms');
  return { avg, min, max, times };
}
