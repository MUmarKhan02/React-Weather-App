import './Forecast.css';
import React from 'react';

 //----------------Handler to convert UTC timestamps to local data/time for selected city------------------\\

const toCityDate = (utcSeconds, tz) => {
  return new Date((utcSeconds + tz) * 1000);
};

 //----------------Forecast function taking in the forecast data, allIcons images, cityTimezone time, and Units measurement------------------\\

const Forecast = ({ forecast, allIcons, cityTimezone,units }) => {
  if (!forecast || forecast.length === 0) return null;//If no data

  return (
    <div className="forecast">
      {/* -----Mapping forecast data---- */}
      {forecast.map((day, index) => {
        const date = toCityDate(day.dt, cityTimezone);

        {/* -----Displays the respective weekday----- */}
        return (
          <div className="forecast-day" key={index}>
            <p className="forecast-date">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </p>
          {/* -----Displays respective weather icon----- */}
            <img
              src={
                allIcons[day.weather[0].icon] ||
                `https://openweathermap.org/img/wn/01d@2x.png`
              }
              alt=""
            />
            {/* -----Displays weather description----- */}
            <p className="forecast-desc"> {day.weather[0].description} </p>
            {/* -----Displays the day's temperature range (min,max)----- */}
            <p className="forecast-temp">
              &uarr;&nbsp;{Math.floor(day.main.temp_max)}°{units === "metric" ? "C" : "F"} | &darr;&nbsp;{Math.floor(day.main.temp_min)}°{units === "metric" ? "C" : "F"}
            </p>
              {/* -----Displays Feels like temperature----- */}
            <p className="forecast-feels">
              Feels like {Math.floor(day.main.feels_like)}°{units === "metric" ? "C" : "F"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Forecast;
