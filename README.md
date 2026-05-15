# React Weather App
A fully responsive weather application built with **React (JavaScript, HTML, CSS)** that allows users to search for any city and view detailed weather information.

The app fetches real-time data from the **OpenWeatherMap API** and displays current conditions, hourly forecasts, and 5-day forecasts in a clean, modern interface.

## Demo
[https://mumarkhan02.github.io/React-Weather-App/](https://mumarkhan02.github.io/React-Weather-App/)

---

## Features

- Search any city manually or via autosuggest dropdown
- Press Enter or click search icon
- Toggle between Celsius and Fahrenheit
- Displays local time (user + selected location)
- 3-Hour interval hourly forecast
- 5-Day daily forecast
- Fully responsive layout

---

## UI & Layout

Users may:
- Enter a city manually
- Press Enter or click the search icon
- Use autosuggest to select from recommended locations


A temperature toggle button in the top-right allows switching between **°C and °F**.

---

## Panels & Overview

After searching for a location, the app displays three panels:

### Current Weather Panel
- Weather icon
- Weather description
- Max / Min temperature
- Local time (user timezone)
- Selected location time (based on its timezone)
- Current date
- Feels like temperature
- Pressure
- Humidity
- Wind speed

---

### 3-Hours Hourly Forecast

Displays forecast data in 3-hour intervals including:

- Time interval
- Weather icon
- Weather description
- Temperature
- Feels like temperature

---

### 5-Day Forecast

Displays daily forecasts for the next 5 days (including today):

- Day name
- Weather icon
- Weather description
- Max / Min temperature
- Feels like temperature
---

# Installation

Clone Project:

```bash
git clone https://github.com/MUmarKhan02/React-Weather-App.git
cd React-Weather-App
```

Install Dependencies ```bash npm install```
Start Server ```bash npm run dev```
App Should Run Locally At ```bash http://localhost:5173```

---

## Built With
- React
- Vite
- JavaScript
- CSS
- OpenWeatherMap API

---
# API Configuration

To run this project, you need an OpenWeatherMap API key.
1. Create a free account at https://openweathermap.org/
2. Generate an API key
3. Store it securely in a .env file: ```bash VITE_WEATHER_API_KEY=your_api_key_here```

Access using: ```bash import.meta.env.VITE_WEATHER_API_KEY```

