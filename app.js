(function() {
  'use strict';

  const STORAGE_KEY = 'weather-app-v1';
  const DEBUG_MODE = new URLSearchParams(window.location.search).has('debug');
  const DEFAULT_STATE = {
    lat: 50.06,
    lon: 19.94,
    cityName: 'Krakow',
    unit: 'C',
    lang: 'pl',
    weather: null,
    aqi: null
  };

  const I18N = {
    pl: {
      appTitle: 'Pogoda | Prognoza i AQI',
      logo: 'Pogoda',
      controlsNav: 'Sterowanie aplikacja pogodowa',
      searchLabel: 'Szukaj miasta',
      searchPlaceholder: 'Szukaj miasta...',
      searchSuggestions: 'Propozycje miast',
      languageSwitch: 'Przelacz jezyk',
      locationLabel: 'Lokalizacja',
      locationAria: 'Uzyj mojej lokalizacji',
      unitAria: 'Przelacz jednostki temperatury',
      themeLabel: 'Motyw',
      themeAria: 'Przelacz motyw jasny i ciemny',
      loadingData: 'Ladowanie danych...',
      loadingWeather: 'Ladowanie danych pogodowych.',
      browserNoGeo: 'Twoja przegladarka nie obsluguje geolokalizacji.',
      locationFetchFailed: 'Nie udalo sie pobrac lokalizacji. Sprawdz uprawnienia przegladarki.',
      searchResultsReady: 'Wyniki wyszukiwania miasta sa dostepne.',
      errorTitle: 'Blad',
      retry: 'Sprobuj ponownie',
      errorFetch: 'Wystapil blad podczas pobierania danych.',
      timeoutError: 'Przekroczono czas oczekiwania na odpowiedz API.',
      offlineError: 'Brak polaczenia z internetem.',
      weatherFetchFailed: 'Nie udalo sie pobrac danych pogodowych. Sprobuj ponownie.',
      myLocation: 'Moja lokalizacja',
      weatherUpdated: 'Dane pogodowe zostaly zaktualizowane dla miasta {city}.',
      stats: 'Statystyki',
      wind: 'Wiatr',
      humidity: 'Wilgotnosc',
      pressure: 'Cisnienie',
      uv: 'Indeks UV',
      visibility: 'Widocznosc',
      cloudiness: 'Zachmurzenie',
      sunriseSunset: 'Wschod / Zachod slonca',
      sunrise: 'Wschod',
      sunset: 'Zachod',
      hourly24h: 'Prognoza godzinowa - 24h',
      hourlyAria: 'Prognoza godzinowa',
      tempChart24h: 'Wykres temperatury 24h',
      tempChartAria: 'Wykres temperatury',
      tempChartSvgAria: 'Wykres temperatury na najblizsze 24 godziny',
      forecast7d: 'Prognoza 7-dniowa',
      forecast7dAria: 'Prognoza siedmiodniowa',
      day: 'Dzien',
      max: 'Max',
      min: 'Min',
      precipitation: 'Opady',
      weatherIcon: 'Ikona pogody',
      today: 'Dzis',
      airQuality: 'Jakosc powietrza',
      airQualityAria: 'Jakosc powietrza',
      noAqiData: 'Brak danych dla tej lokalizacji',
      europeanAqi: 'Europejski AQI',
      footerText: 'Open-Meteo API - Swiss Design',
      aqiVeryGood: 'Bardzo dobra',
      aqiGood: 'Dobra',
      aqiModerate: 'Umiarkowana',
      aqiBad: 'Zla',
      aqiVeryBad: 'Bardzo zla',
      aqiHazardous: 'Niebezpieczna',
      wmoUnknown: 'Nieznane',
      wmo0: 'Bezchmurnie',
      wmo1: 'Przewaznie czyste',
      wmo2: 'Czesciowe zachmurzenie',
      wmo3: 'Pochmurno',
      wmo45: 'Mgla',
      wmo48: 'Mgla szronowa',
      wmo51: 'Lekka mzawka',
      wmo53: 'Umiarkowana mzawka',
      wmo55: 'Gesta mzawka',
      wmo56: 'Mzawka marznaca',
      wmo57: 'Gesta mzawka marznaca',
      wmo61: 'Lekki deszcz',
      wmo63: 'Umiarkowany deszcz',
      wmo65: 'Silny deszcz',
      wmo66: 'Deszcz marznacy',
      wmo67: 'Silny deszcz marznacy',
      wmo71: 'Lekki snieg',
      wmo73: 'Umiarkowany snieg',
      wmo75: 'Silny snieg',
      wmo77: 'Ziarna sniegu',
      wmo80: 'Lekkie opady',
      wmo81: 'Umiarkowane opady',
      wmo82: 'Gwaltowne opady',
      wmo85: 'Lekkie opady sniegu',
      wmo86: 'Silne opady sniegu',
      wmo95: 'Burza',
      wmo96: 'Burza z gradem',
      wmo99: 'Burza z silnym gradem'
    },
    en: {
      appTitle: 'Weather | Forecast and AQI',
      logo: 'Weather',
      controlsNav: 'Weather app controls',
      searchLabel: 'Search city',
      searchPlaceholder: 'Search city...',
      searchSuggestions: 'City suggestions',
      languageSwitch: 'Switch language',
      locationLabel: 'Location',
      locationAria: 'Use my location',
      unitAria: 'Toggle temperature units',
      themeLabel: 'Theme',
      themeAria: 'Toggle light and dark theme',
      loadingData: 'Loading data...',
      loadingWeather: 'Loading weather data.',
      browserNoGeo: 'Your browser does not support geolocation.',
      locationFetchFailed: 'Could not get location. Check browser permissions.',
      searchResultsReady: 'City search results are available.',
      errorTitle: 'Error',
      retry: 'Try again',
      errorFetch: 'An error occurred while fetching data.',
      timeoutError: 'API request timed out.',
      offlineError: 'No internet connection.',
      weatherFetchFailed: 'Could not fetch weather data. Try again.',
      myLocation: 'My location',
      weatherUpdated: 'Weather data updated for {city}.',
      stats: 'Stats',
      wind: 'Wind',
      humidity: 'Humidity',
      pressure: 'Pressure',
      uv: 'UV index',
      visibility: 'Visibility',
      cloudiness: 'Cloudiness',
      sunriseSunset: 'Sunrise / Sunset',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      hourly24h: 'Hourly forecast - 24h',
      hourlyAria: 'Hourly forecast',
      tempChart24h: '24h temperature chart',
      tempChartAria: 'Temperature chart',
      tempChartSvgAria: 'Temperature chart for the next 24 hours',
      forecast7d: '7-day forecast',
      forecast7dAria: 'Seven-day forecast',
      day: 'Day',
      max: 'Max',
      min: 'Min',
      precipitation: 'Precip',
      weatherIcon: 'Weather icon',
      today: 'Today',
      airQuality: 'Air quality',
      airQualityAria: 'Air quality',
      noAqiData: 'No data for this location',
      europeanAqi: 'European AQI',
      footerText: 'Open-Meteo API - Swiss Design',
      aqiVeryGood: 'Very good',
      aqiGood: 'Good',
      aqiModerate: 'Moderate',
      aqiBad: 'Poor',
      aqiVeryBad: 'Very poor',
      aqiHazardous: 'Hazardous',
      wmoUnknown: 'Unknown',
      wmo0: 'Clear sky',
      wmo1: 'Mainly clear',
      wmo2: 'Partly cloudy',
      wmo3: 'Overcast',
      wmo45: 'Fog',
      wmo48: 'Rime fog',
      wmo51: 'Light drizzle',
      wmo53: 'Moderate drizzle',
      wmo55: 'Dense drizzle',
      wmo56: 'Freezing drizzle',
      wmo57: 'Dense freezing drizzle',
      wmo61: 'Light rain',
      wmo63: 'Moderate rain',
      wmo65: 'Heavy rain',
      wmo66: 'Freezing rain',
      wmo67: 'Heavy freezing rain',
      wmo71: 'Light snow',
      wmo73: 'Moderate snow',
      wmo75: 'Heavy snow',
      wmo77: 'Snow grains',
      wmo80: 'Light showers',
      wmo81: 'Moderate showers',
      wmo82: 'Violent showers',
      wmo85: 'Light snow showers',
      wmo86: 'Heavy snow showers',
      wmo95: 'Thunderstorm',
      wmo96: 'Thunderstorm with hail',
      wmo99: 'Severe hailstorm'
    }
  };

  let state = loadSavedState();

  const appEl = document.getElementById('app');
  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');
  const unitBtn = document.getElementById('unitBtn');
  const geoBtn = document.getElementById('geoBtn');
  const searchInput = document.getElementById('searchInput');
  const autocompleteEl = document.getElementById('autocomplete');
  const srStatus = document.getElementById('srStatus');
  let autocompleteResults = [];
  let hourlyScrollLeft = 0;
  let debugBenchDone = false;

  applySavedTheme();
  applyLanguageToStaticUi();
  unitBtn.textContent = '\u00B0' + state.unit;
  unitBtn.setAttribute('aria-pressed', String(state.unit === 'F'));

  langBtn.addEventListener('click', () => {
    const prevLang = state.lang;
    state.lang = state.lang === 'pl' ? 'en' : 'pl';

    if (state.cityName === I18N[prevLang].myLocation) {
      state.cityName = I18N[state.lang].myLocation;
    }

    persistState();
    applyLanguageToStaticUi();
    if (state.weather) {
      render();
    } else {
      showLoading();
    }
  });

  themeBtn.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
    saveTheme(next);
  });

  unitBtn.addEventListener('click', () => {
    state.unit = state.unit === 'C' ? 'F' : 'C';
    unitBtn.textContent = '\u00B0' + state.unit;
    unitBtn.setAttribute('aria-pressed', String(state.unit === 'F'));
    persistState();
    if (state.weather) render();
  });

  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showError(t('browserNoGeo'), false);
      return;
    }

    geoBtn.textContent = '...';
    geoBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      pos => {
        state.lat = Math.round(pos.coords.latitude * 100) / 100;
        state.lon = Math.round(pos.coords.longitude * 100) / 100;
        state.cityName = t('myLocation');
        persistState();
        resetGeoButton();
        fetchAll();
      },
      () => {
        resetGeoButton();
        showError(t('locationFetchFailed'), false);
      },
      { timeout: 10000 }
    );
  });

  let searchTimeout = null;
  let acIndex = -1;

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const q = searchInput.value.trim();

    if (q.length < 2) {
      closeAutocomplete();
      return;
    }

    searchTimeout = setTimeout(() => {
      const geoLang = state.lang === 'en' ? 'en' : 'pl';
      const url = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(q) + '&count=5&language=' + geoLang;

      fetch(url)
        .then(r => {
          if (!r.ok) throw new Error('geocoding_failed');
          return r.json();
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
          announce(t('searchResultsReady'));
        })
        .catch(() => {
          closeAutocomplete();
        });
    }, 300);
  });

  autocompleteEl.addEventListener('click', e => {
    const optionEl = e.target.closest('.autocomplete-item');
    if (!optionEl) return;

    const idx = Number(optionEl.dataset.index);
    if (!Number.isInteger(idx) || !autocompleteResults[idx]) return;

    const result = autocompleteResults[idx];
    state.lat = result.latitude;
    state.lon = result.longitude;
    state.cityName = result.name;
    searchInput.value = '';
    persistState();
    closeAutocomplete();
    fetchAll();
  });

  document.addEventListener('click', e => {
    if (!autocompleteEl.contains(e.target) && e.target !== searchInput) {
      closeAutocomplete();
    }
  });

  searchInput.addEventListener('keydown', e => {
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
      if (acIndex >= 0 && items[acIndex]) items[acIndex].click();
    } else if (e.key === 'Escape') {
      closeAutocomplete();
    }
  });

  const acObserver = new MutationObserver(() => {
    acIndex = -1;
    searchInput.removeAttribute('aria-activedescendant');
  });
  acObserver.observe(autocompleteEl, { childList: true });

  window.addEventListener('beforeunload', () => {
    acObserver.disconnect();
  });

  function syncAutocompleteActive(items) {
    items.forEach((it, i) => {
      const isActive = i === acIndex;
      it.classList.toggle('active', isActive);
      it.setAttribute('aria-selected', String(isActive));
      if (isActive) {
        searchInput.setAttribute('aria-activedescendant', it.id);
      }
    });
  }

  function closeAutocomplete() {
    autocompleteEl.classList.remove('active');
    searchInput.setAttribute('aria-expanded', 'false');
    searchInput.removeAttribute('aria-activedescendant');
    autocompleteResults = [];
    acIndex = -1;
  }

  function resetGeoButton() {
    geoBtn.textContent = t('locationLabel');
    geoBtn.disabled = false;
  }

  function t(key, vars) {
    const table = I18N[state.lang] || I18N.pl;
    let value = table[key] || I18N.pl[key] || key;

    if (vars) {
      Object.keys(vars).forEach(name => {
        value = value.replace('{' + name + '}', String(vars[name]));
      });
    }

    return value;
  }

  function applyLanguageToStaticUi() {
    const html = document.documentElement;
    html.lang = state.lang;
    document.title = t('appTitle');

    const logo = document.querySelector('.logo');
    if (logo) logo.textContent = t('logo');

    const controlsNav = document.querySelector('.header-controls');
    if (controlsNav) controlsNav.setAttribute('aria-label', t('controlsNav'));

    const searchLabel = document.querySelector('label[for="searchInput"]');
    if (searchLabel) searchLabel.textContent = t('searchLabel');

    searchInput.placeholder = t('searchPlaceholder');
    searchInput.setAttribute('aria-label', t('searchLabel'));
    autocompleteEl.setAttribute('aria-label', t('searchSuggestions'));

    langBtn.textContent = state.lang.toUpperCase();
    langBtn.setAttribute('aria-label', t('languageSwitch'));

    geoBtn.textContent = t('locationLabel');
    geoBtn.setAttribute('aria-label', t('locationAria'));

    unitBtn.setAttribute('aria-label', t('unitAria'));

    themeBtn.textContent = t('themeLabel');
    themeBtn.setAttribute('aria-label', t('themeAria'));

    const footerText = document.querySelector('.footer-text');
    if (footerText) footerText.textContent = t('footerText');
  }

  function loadSavedState() {
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

  function persistState() {
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

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY + ':theme', theme);
    } catch {
      // Ignore quota errors.
    }
  }

  function applySavedTheme() {
    let theme = 'light';
    try {
      const fromStorage = localStorage.getItem(STORAGE_KEY + ':theme');
      if (fromStorage === 'dark' || fromStorage === 'light') theme = fromStorage;
    } catch {
      theme = 'light';
    }

    document.documentElement.setAttribute('data-theme', theme);
    themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  function toUnit(celsius) {
    if (state.unit === 'F') return Math.round(celsius * 9 / 5 + 32);
    return Math.round(celsius);
  }

  function unitSymbol() {
    return state.unit === 'F' ? '\u00B0F' : '\u00B0C';
  }

  function weatherInfo(code) {
    const map = {
      0: { desc: t('wmo0'), icon: iconSun },
      1: { desc: t('wmo1'), icon: iconSunCloud },
      2: { desc: t('wmo2'), icon: iconSunCloud },
      3: { desc: t('wmo3'), icon: iconCloud },
      45: { desc: t('wmo45'), icon: iconFog },
      48: { desc: t('wmo48'), icon: iconFog },
      51: { desc: t('wmo51'), icon: iconDrizzle },
      53: { desc: t('wmo53'), icon: iconDrizzle },
      55: { desc: t('wmo55'), icon: iconDrizzle },
      56: { desc: t('wmo56'), icon: iconDrizzle },
      57: { desc: t('wmo57'), icon: iconDrizzle },
      61: { desc: t('wmo61'), icon: iconRain },
      63: { desc: t('wmo63'), icon: iconRain },
      65: { desc: t('wmo65'), icon: iconRain },
      66: { desc: t('wmo66'), icon: iconRain },
      67: { desc: t('wmo67'), icon: iconRain },
      71: { desc: t('wmo71'), icon: iconSnow },
      73: { desc: t('wmo73'), icon: iconSnow },
      75: { desc: t('wmo75'), icon: iconSnow },
      77: { desc: t('wmo77'), icon: iconSnow },
      80: { desc: t('wmo80'), icon: iconRain },
      81: { desc: t('wmo81'), icon: iconRain },
      82: { desc: t('wmo82'), icon: iconRain },
      85: { desc: t('wmo85'), icon: iconSnow },
      86: { desc: t('wmo86'), icon: iconSnow },
      95: { desc: t('wmo95'), icon: iconStorm },
      96: { desc: t('wmo96'), icon: iconStorm },
      99: { desc: t('wmo99'), icon: iconStorm }
    };
    return map[code] || { desc: t('wmoUnknown'), icon: iconCloud };
  }

  function iconSun() {
    return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="10" stroke="currentColor" stroke-width="2.5"/><line x1="24" y1="2" x2="24" y2="8" stroke="currentColor" stroke-width="2.5"/><line x1="24" y1="40" x2="24" y2="46" stroke="currentColor" stroke-width="2.5"/><line x1="2" y1="24" x2="8" y2="24" stroke="currentColor" stroke-width="2.5"/><line x1="40" y1="24" x2="46" y2="24" stroke="currentColor" stroke-width="2.5"/><line x1="8.3" y1="8.3" x2="12.5" y2="12.5" stroke="currentColor" stroke-width="2.5"/><line x1="35.5" y1="35.5" x2="39.7" y2="39.7" stroke="currentColor" stroke-width="2.5"/><line x1="8.3" y1="39.7" x2="12.5" y2="35.5" stroke="currentColor" stroke-width="2.5"/><line x1="35.5" y1="12.5" x2="39.7" y2="8.3" stroke="currentColor" stroke-width="2.5"/></svg>';
  }
  function iconSunCloud() {
    return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="16" r="7" stroke="currentColor" stroke-width="2"/><line x1="18" y1="4" x2="18" y2="6" stroke="currentColor" stroke-width="2"/><line x1="18" y1="26" x2="18" y2="28" stroke="currentColor" stroke-width="2"/><line x1="8" y1="16" x2="6" y2="16" stroke="currentColor" stroke-width="2"/><line x1="30" y1="16" x2="28" y2="16" stroke="currentColor" stroke-width="2"/><path d="M14 30 C14 26 18 22 24 22 C28 22 31 24 32 27 C36 27.5 39 30 39 34 C39 38 36 40 32 40 L18 40 C14 40 12 37 12 34 C12 32 13 30.5 14 30Z" stroke="currentColor" stroke-width="2"/></svg>';
  }
  function iconCloud() {
    return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 32 C8 32 6 29 6 26 C6 23 8 20 12 20 C12 14 17 10 23 10 C28 10 32 13 33 18 C37 18.5 40 21 40 25 C40 29 37 32 33 32Z" stroke="currentColor" stroke-width="2.5"/></svg>';
  }
  function iconFog() {
    return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" stroke-width="2.5"/><line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" stroke-width="2.5"/><line x1="10" y1="30" x2="38" y2="30" stroke="currentColor" stroke-width="2.5"/><line x1="14" y1="36" x2="34" y2="36" stroke="currentColor" stroke-width="2.5"/></svg>';
  }
  function iconDrizzle() {
    return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 26 C8 26 6 23 6 20 C6 17 8 14 12 14 C12 8 17 4 23 4 C28 4 32 7 33 12 C37 12.5 40 15 40 19 C40 23 37 26 33 26Z" stroke="currentColor" stroke-width="2"/><line x1="14" y1="32" x2="13" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="32" x2="21" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="30" y1="32" x2="29" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  }
  function iconRain() {
    return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24 C8 24 6 21 6 18 C6 15 8 12 12 12 C12 6 17 2 23 2 C28 2 32 5 33 10 C37 10.5 40 13 40 17 C40 21 37 24 33 24Z" stroke="currentColor" stroke-width="2"/><line x1="14" y1="30" x2="12" y2="38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="23" y1="30" x2="21" y2="38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="32" y1="30" x2="30" y2="38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
  }
  function iconSnow() {
    return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24 C8 24 6 21 6 18 C6 15 8 12 12 12 C12 6 17 2 23 2 C28 2 32 5 33 10 C37 10.5 40 13 40 17 C40 21 37 24 33 24Z" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="33" r="2" fill="currentColor"/><circle cx="24" cy="33" r="2" fill="currentColor"/><circle cx="34" cy="33" r="2" fill="currentColor"/><circle cx="19" cy="40" r="2" fill="currentColor"/><circle cx="29" cy="40" r="2" fill="currentColor"/></svg>';
  }
  function iconStorm() {
    return '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22 C8 22 6 19 6 16 C6 13 8 10 12 10 C12 4 17 0 23 0 C28 0 32 3 33 8 C37 8.5 40 11 40 15 C40 19 37 22 33 22Z" stroke="currentColor" stroke-width="2"/><polygon points="22,26 18,36 23,36 20,46 30,33 25,33 28,26" fill="currentColor"/></svg>';
  }

  function showLoading() {
    const fragment = document.createDocumentFragment();

    const status = createEl('div', 'loading-text col-12', t('loadingData'));
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
    announce(t('loadingWeather'));
  }

  function showError(message, canRetry) {
    let html = '<div class="card col-12 error-box" role="alert">';
    html += '<div class="label">' + t('errorTitle') + '</div>';
    html += '<p class="error-message">' + escapeHtml(message) + '</p>';
    if (canRetry) {
      html += '<button class="btn" id="retryBtn" type="button">' + t('retry') + '</button>';
    }
    html += '</div>';

    appEl.innerHTML = html;

    if (canRetry) {
      const retryBtn = document.getElementById('retryBtn');
      if (retryBtn) {
        retryBtn.addEventListener('click', fetchAll);
        retryBtn.focus();
      }
    }

    announce(t('errorFetch'));
  }

  function fetchJsonWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    return fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error('http_' + response.status);
        }
        return response.json();
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });
  }

  function fetchAll() {
    const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + state.lat
      + '&longitude=' + state.lon
      + '&current_weather=true'
      + '&hourly=temperature_2m,precipitation_probability,windspeed_10m,uv_index,visibility,relativehumidity_2m,surface_pressure,weathercode'
      + '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,weathercode'
      + '&timezone=auto&forecast_days=7';

    const aqiUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + state.lat
      + '&longitude=' + state.lon
      + '&current=european_aqi'
      + '&hourly=european_aqi'
      + '&timezone=auto';

    showLoading();

    Promise.all([
      fetchJsonWithTimeout(weatherUrl, 12000),
      fetchJsonWithTimeout(aqiUrl, 12000).catch(() => null)
    ])
      .then(([weather, aqi]) => {
        state.weather = weather;
        state.aqi = aqi;
        persistState();
        render();
        if (DEBUG_MODE && !debugBenchDone) {
          debugBenchDone = true;
          setTimeout(() => {
            runRenderBenchmark(10);
          }, 0);
        }
      })
      .catch(error => {
        if (error && error.name === 'AbortError') {
          showError(t('timeoutError'), true);
          return;
        }

        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
          showError(t('offlineError'), true);
          return;
        }

        showError(t('weatherFetchFailed'), true);
      });
  }

  function aqiDescription(val) {
    if (val <= 20) return t('aqiVeryGood');
    if (val <= 40) return t('aqiGood');
    if (val <= 60) return t('aqiModerate');
    if (val <= 80) return t('aqiBad');
    if (val <= 100) return t('aqiVeryBad');
    return t('aqiHazardous');
  }

  function aqiPercent(val) {
    return Math.min(100, Math.round((val / 150) * 100));
  }

  function shortDay(dateStr) {
    const days = state.lang === 'en'
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['Ndz', 'Pon', 'Wt', 'Sr', 'Czw', 'Pt', 'Sob'];
    const d = new Date(dateStr + 'T00:00:00');
    return days[d.getDay()];
  }

  function getCurrentHourIndex(times) {
    const now = new Date();
    let best = 0;
    let bestDiff = Infinity;

    for (let i = 0; i < times.length; i++) {
      const t = new Date(times[i]);
      const diff = Math.abs(now - t);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = i;
      }
    }

    return best;
  }

  function formatHour(isoStr) {
    const d = new Date(isoStr);
    return String(d.getHours()).padStart(2, '0') + ':00';
  }

  function formatSunTime(isoStr) {
    const d = new Date(isoStr);
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function buildTempChart(hourlyTimes, hourlyTemps, startIdx) {
    const count = 24;
    const temps = [];
    const labels = [];

    for (let i = 0; i < count; i += 2) {
      const idx = startIdx + i;
      if (idx < hourlyTemps.length) {
        temps.push(toUnit(hourlyTemps[idx]));
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

    const points = temps.map((t, i) => {
      const x = padLeft + i * stepX;
      const y = padTop + (1 - (t - minT) / rangeT) * (h - padTop - padBot);
      return { x, y, temp: t, label: labels[i] };
    });

    const pathD = points
      .map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1))
      .join(' ');

    let svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + t('tempChartSvgAria') + '">';

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

  function sunProgress(sunrise, sunset) {
    const now = new Date();
    const rise = new Date(sunrise);
    const set = new Date(sunset);

    if (now < rise) return 0;
    if (now > set) return 100;

    return Math.round(((now - rise) / (set - rise)) * 100);
  }

  function createEl(tagName, className, text) {
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
    const bigNumber = createEl('div', 'big-number', toUnit(cw.temperature));
    bigNumber.appendChild(createEl('span', 'temp-unit', unitSymbol()));
    tempRow.appendChild(bigNumber);
    tempRow.appendChild(createWeatherIcon('weather-icon', info.icon));

    card.appendChild(top);
    card.appendChild(tempRow);
    card.appendChild(createEl('div', 'description', info.desc));
    return card;
  }

  function createStatsCard(data) {
    const card = createEl('div', 'card col-6');
    card.appendChild(createEl('div', 'label', t('stats')));

    const statsGrid = createEl('div', 'stats-grid');
    statsGrid.appendChild(createStatItem(t('wind'), data.windSpeed + ' km/h'));
    statsGrid.appendChild(createStatItem(t('humidity'), data.humidity + '%'));
    statsGrid.appendChild(createStatItem(t('pressure'), data.pressure + ' hPa'));
    statsGrid.appendChild(createStatItem(t('uv'), data.uvIndex));
    statsGrid.appendChild(createStatItem(t('visibility'), data.visibility + ' km'));
    statsGrid.appendChild(createStatItem(t('cloudiness'), data.cloudiness));
    card.appendChild(statsGrid);

    const sunWrap = createEl('div', 'sun-wrap');
    sunWrap.appendChild(createEl('div', 'label', t('sunriseSunset')));

    const sunTimes = createEl('div', 'sun-times');

    const sunriseCol = createEl('div');
    sunriseCol.appendChild(createEl('div', 'label', t('sunrise')));
    sunriseCol.appendChild(createEl('div', 'sun-time-value', formatSunTime(data.sunrise)));

    const sunsetCol = createEl('div', 'sun-time-end');
    sunsetCol.appendChild(createEl('div', 'label', t('sunset')));
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
    section.setAttribute('aria-label', t('hourlyAria'));
    section.appendChild(createEl('div', 'label', t('hourly24h')));

    const scroll = createEl('div', 'hourly-scroll');
    for (let i = 0; i < 24; i += 2) {
      const idx = hourIdx + i;
      if (idx >= w.hourly.time.length) break;

      const hCode = w.hourly.weathercode ? w.hourly.weathercode[idx] : guessHourWeatherCode(w, idx);
      const hInfo = weatherInfo(hCode);

      const item = createEl('div', 'hourly-item');
      item.appendChild(createEl('div', 'hourly-time', formatHour(w.hourly.time[idx])));
      item.appendChild(createWeatherIcon('hourly-icon', hInfo.icon));
      item.appendChild(createEl('div', 'hourly-temp', toUnit(w.hourly.temperature_2m[idx]) + '\u00B0'));
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
    section.setAttribute('aria-label', t('tempChartAria'));
    section.appendChild(createEl('div', 'label', t('tempChart24h')));

    const container = createEl('div', 'chart-container');
    container.innerHTML = buildTempChart(w.hourly.time, w.hourly.temperature_2m, hourIdx);
    section.appendChild(container);
    return section;
  }

  function createForecastSection(w) {
    const section = createEl('section', 'card col-8');
    section.setAttribute('aria-label', t('forecast7dAria'));
    section.appendChild(createEl('div', 'label', t('forecast7d')));

    const table = createEl('table', 'forecast-table');
    const thead = createEl('thead');
    const headRow = createEl('tr');

    const headers = [t('day'), t('max'), t('min'), t('precipitation')];
    headers.forEach(header => {
      const th = createEl('th', null, header);
      th.scope = 'col';
      headRow.appendChild(th);
    });

    const iconTh = createEl('th');
    iconTh.scope = 'col';
    iconTh.appendChild(createEl('span', 'visually-hidden', t('weatherIcon')));
    headRow.appendChild(iconTh);

    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = createEl('tbody');
    for (let i = 0; i < w.daily.time.length; i++) {
      const dInfo = weatherInfo(w.daily.weathercode[i]);
      const dn = i === 0 ? t('today') : shortDay(w.daily.time[i]);

      const row = createEl('tr');
      row.appendChild(createEl('td', 'day-name', dn));
      row.appendChild(createEl('td', 'temp-max', toUnit(w.daily.temperature_2m_max[i]) + '\u00B0'));
      row.appendChild(createEl('td', 'temp-min', toUnit(w.daily.temperature_2m_min[i]) + '\u00B0'));
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
    section.setAttribute('aria-label', t('airQualityAria'));

    section.appendChild(createEl('div', 'label', t('airQuality')));
    section.appendChild(createEl('div', 'aqi-value', aqiVal));
    section.appendChild(createEl('div', 'aqi-desc', typeof aqiVal === 'number' ? aqiDescription(aqiVal) : t('noAqiData')));

    const barTrack = createEl('div', 'aqi-bar-track');
    const barFill = createEl('div', 'aqi-bar-fill');
    barFill.id = 'aqiBar';
    barTrack.appendChild(barFill);
    section.appendChild(barTrack);

    const noteWrap = createEl('div', 'aqi-note');
    noteWrap.appendChild(createEl('span', 'label', t('europeanAqi')));
    section.appendChild(noteWrap);

    return section;
  }

  function render(options) {
    const renderOptions = options || {};
    const silent = renderOptions.silent === true;
    const w = state.weather;
    const a = state.aqi;
    if (!w) return;

    const cw = w.current_weather;
    const info = weatherInfo(cw.weathercode);
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
      announce(t('weatherUpdated', { city: state.cityName }));
    }
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

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str == null ? '' : String(str)));
    return div.innerHTML;
  }

  function announce(message) {
    if (!srStatus) return;
    srStatus.textContent = '';
    requestAnimationFrame(() => {
      srStatus.textContent = message;
    });
  }

  function runSelfTests() {
    const results = [];

    function test(name, fn) {
      try {
        fn();
        results.push({ name, ok: true });
      } catch (error) {
        results.push({ name, ok: false, message: error && error.message ? error.message : String(error) });
      }
    }

    test('aqiPercent caps at 100', () => {
      if (aqiPercent(200) !== 100) throw new Error('Expected 100');
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

    test('toUnit converts C to F', () => {
      const prev = state.unit;
      state.unit = 'F';
      const value = toUnit(0);
      state.unit = prev;
      if (value !== 32) throw new Error('Expected 32');
    });

    const passed = results.filter(r => r.ok).length;
    const failed = results.length - passed;
    console.groupCollapsed('[debug] Self-tests: ' + passed + '/' + results.length + ' passed');
    results.forEach(r => {
      if (r.ok) {
        console.log('PASS - ' + r.name);
      } else {
        console.error('FAIL - ' + r.name + ' - ' + r.message);
      }
    });
    console.groupEnd();

    return { passed, failed, total: results.length };
  }

  function runRenderBenchmark(iterations) {
    const count = Number.isInteger(iterations) && iterations > 0 ? iterations : 8;
    const times = [];

    for (let i = 0; i < count; i++) {
      const start = performance.now();
      render({ silent: true });
      times.push(performance.now() - start);
    }

    const total = times.reduce((sum, value) => sum + value, 0);
    const avg = total / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    console.info('[debug] Render benchmark (' + count + ' runs): avg=' + avg.toFixed(2) + 'ms, min=' + min.toFixed(2) + 'ms, max=' + max.toFixed(2) + 'ms');
    return { avg, min, max, times };
  }

  if (DEBUG_MODE) {
    runSelfTests();
  }

  fetchAll();
})();
