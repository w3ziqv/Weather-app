# Weather App (Swiss Design)

A minimalist weather website built with HTML, CSS, and modular JavaScript (ES Modules).
It fetches live weather, forecast, geocoding, and air quality data from Open-Meteo APIs and presents them in a clean Swiss-inspired layout.

## Live Features

- Current weather for the selected city
- City search with autocomplete (Open-Meteo Geocoding)
- Geolocation button for local weather
- Celsius/Fahrenheit unit toggle
- Light/dark theme toggle
- 24-hour hourly forecast strip
- 24-hour temperature chart (SVG)
- 7-day forecast table
- Air quality panel (European AQI)
- Sunrise/sunset progress indicator
- Component-style DOM rendering (without framework)
- Loading skeleton to reduce layout shifts (better CLS)
- Initial HTML skeleton (before JS execution) for stable first paint
- Stable header control widths to reduce micro layout shifts
- Better error handling with retry button
- Basic accessibility improvements (ARIA/live status)
- Settings persistence with localStorage (city, units, theme)
- Responsive layout for desktop and mobile

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES Modules, no framework)
- Open-Meteo APIs
- Vitest (unit testing)
- GitHub Actions (CI)

## API Endpoints Used

- Forecast API: `https://api.open-meteo.com/v1/forecast`
- Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Air Quality API: `https://air-quality-api.open-meteo.com/v1/air-quality`

## Run Locally

This project uses ES Modules, so it must be served over HTTP (not opened directly via `file://`).

### Option 1: Use VS Code Live Server (recommended)

1. Install the Live Server extension in VS Code.
2. Right-click `index.html`.
3. Click **Open with Live Server**.

### Option 2: Use any static server

```bash
npx serve .
# or
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Tests

```bash
npm install
npm test
```

Tests cover the pure utility functions: unit conversion, AQI percentage/description, sun progress, date/time formatting, and hour index calculation.

## Project Structure

```text
.
├── src/
│   ├── i18n.js        # Translation constants and t() helper
│   ├── state.js       # Application state singleton, localStorage persistence
│   ├── utils.js       # Pure utility functions (unit conversion, AQI, sun progress, formatting)
│   ├── icons.js       # SVG icon generators and WMO weather code mapping
│   ├── api.js         # Open-Meteo API client (fetch with timeout)
│   ├── render.js      # DOM rendering functions (cards, chart, loading, error states)
│   └── main.js        # Entry point: event listeners, autocomplete, debug mode
├── tests/
│   └── utils.test.js  # Vitest unit tests for pure utility functions
├── .github/
│   └── workflows/
│       └── ci.yml     # GitHub Actions: runs tests on push/PR
├── index.html
├── styles.css
├── package.json
├── vitest.config.js
└── README.md
```

## Notes

- No API key is required for the Open-Meteo endpoints used in this project.
- Internet connection is required to fetch live weather and air quality data.
- Default startup location is Krakow (`lat: 50.06`, `lon: 19.94`).
- Debug mode is available with `?debug=1`.

## Debug Mode (Tests + Benchmark)

You can run built-in debug checks directly in the browser console.

1. Open the app with the `debug` query param, for example:
   - `index.html?debug=1`
2. Open DevTools Console.

In debug mode the app runs:
- lightweight self-tests for utility logic (unit conversion, AQI cap, sun progress bounds)
- one render benchmark after the first successful data load (10 runs with avg/min/max)

## Author

- GitHub: [w3ziqv](https://github.com/w3ziqv)
