import React from "react";
import "./HourlyForecast.css";

const HourlyForecast = ({ forecast, allIcons, cityTimezone,units }) => {
  if (!forecast.length) return null;

  const toCityTime = (utcSeconds) => {
    return new Date((utcSeconds + cityTimezone) * 1000);
  };

  const nextHours = forecast;
  return (
    <div className="hourly-forecast">
      {nextHours.map((hourData, idx) => {
        const cityTime = toCityTime(hourData.dt);
        {/* -----Formats and displays the time in 12 hour setting----- */}
        return (
          <div className="hour-block" key={idx}>
            <p className="hour-time">
              {cityTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                hour: "numeric"
              })}
            </p>
              {/* -----Displays the weather icon for each time interval----- */}
            <img
              src={allIcons[hourData.weather[0].icon] || "https://openweathermap.org/img/wn/01d@2x.png"}
              alt=""
            />
            {/* -----Displays the weather's description for each time interval----- */}
            <p className="hour-desc"> {hourData.weather[0].description} </p>
            {/* -----Displays the temperature for each time interval----- */}
            <p className="hour-temp">
              {Math.floor(hourData.main.temp)}°{units === "metric" ? "C" : "F"}
            </p>
              {/* -----Displays the feels like temperature for each time interval----- */}
            <p className="hour-feels">
              Feels like {Math.floor(hourData.main.feels_like)}°{units === "metric" ? "C" : "F"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default HourlyForecast;
