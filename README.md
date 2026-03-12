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
├── index.html
└── README.md
```

## Notes

- No API key is required for the Open-Meteo endpoints used in this project.
- Internet connection is required to fetch live weather and air quality data.
- Default startup location is Warsaw (`lat: 52.23`, `lon: 21.01`).

## Author

- GitHub: [w3ziqv](https://github.com/w3ziqv)

## License

This project is open source. You can add a `LICENSE` file (for example MIT) if you want to define reuse terms explicitly.
