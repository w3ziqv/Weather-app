# Weather App (Swiss Design)

A minimalist weather website built with pure HTML, CSS, and JavaScript.
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
- Vanilla JavaScript (no framework)
- Open-Meteo APIs

## API Endpoints Used

- Forecast API: `https://api.open-meteo.com/v1/forecast`
- Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Air Quality API: `https://air-quality-api.open-meteo.com/v1/air-quality`

## Run Locally

Because this is a static site, you can run it in several ways:

### Option 1: Open directly

1. Open `index.html` in your browser.

### Option 2: Use VS Code Live Server (recommended)

1. Install the Live Server extension in VS Code.
2. Right-click `index.html`.
3. Click **Open with Live Server**.

## Project Structure

```text
.
├── app.js
├── index.html
├── styles.css
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
