// i18n.ts — Internationalisation constants and translation helper

export type Lang = 'pl' | 'en';

export type I18nKey =
  | 'appTitle' | 'logo' | 'controlsNav' | 'searchLabel' | 'searchPlaceholder'
  | 'searchSuggestions' | 'languageSwitch' | 'locationLabel' | 'locationAria'
  | 'unitAria' | 'themeLabel' | 'themeAria' | 'loadingData' | 'loadingWeather'
  | 'browserNoGeo' | 'locationFetchFailed' | 'searchResultsReady' | 'errorTitle'
  | 'retry' | 'errorFetch' | 'timeoutError' | 'offlineError' | 'weatherFetchFailed'
  | 'myLocation' | 'weatherUpdated' | 'stats' | 'wind' | 'humidity' | 'pressure'
  | 'uv' | 'visibility' | 'cloudiness' | 'sunriseSunset' | 'sunrise' | 'sunset'
  | 'hourly24h' | 'hourlyAria' | 'tempChart24h' | 'tempChartAria' | 'tempChartSvgAria'
  | 'forecast7d' | 'forecast7dAria' | 'day' | 'max' | 'min' | 'precipitation'
  | 'weatherIcon' | 'today' | 'airQuality' | 'airQualityAria' | 'noAqiData'
  | 'europeanAqi' | 'footerText' | 'aqiVeryGood' | 'aqiGood' | 'aqiModerate'
  | 'aqiBad' | 'aqiVeryBad' | 'aqiHazardous' | 'wmoUnknown' | 'wmo0' | 'wmo1'
  | 'wmo2' | 'wmo3' | 'wmo45' | 'wmo48' | 'wmo51' | 'wmo53' | 'wmo55' | 'wmo56'
  | 'wmo57' | 'wmo61' | 'wmo63' | 'wmo65' | 'wmo66' | 'wmo67' | 'wmo71' | 'wmo73'
  | 'wmo75' | 'wmo77' | 'wmo80' | 'wmo81' | 'wmo82' | 'wmo85' | 'wmo86' | 'wmo95'
  | 'wmo96' | 'wmo99';

type I18nTable = Record<I18nKey, string>;

export const I18N: Record<Lang, I18nTable> = {
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

export function t(key: I18nKey, lang: Lang, vars?: Record<string, string | number>): string {
  const table = I18N[lang] || I18N.pl;
  let value: string = table[key] || I18N.pl[key] || key;

  if (vars) {
    for (const name of Object.keys(vars)) {
      value = value.replace('{' + name + '}', String(vars[name]));
    }
  }

  return value;
}
