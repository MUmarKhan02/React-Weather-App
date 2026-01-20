//----------------Import Files & React Hooks------------------\\
import React, { useEffect, useState, useRef } from 'react'
import './Weather.css'
import Forecast from './Forecast'
import HourlyForecast from './HourlyForecast'

//----------------Import Images------------------\\

import search_icon from "../assets/search.png"
import cloud_icon from "../assets/cloud.png"
import humidity_icon from "../assets/humidity.png"
import wind_icon from "../assets/wind.png"
import feels_like_icon from "../assets/feelsLike.png"
import pressure_icon from "../assets/pressure.png"


//----------------Helper Function: City-Local Date Key------------------\\

const toCityDateKey = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return d.toISOString().split("T")[0]; // yyyy-mm-dd (city local)
};

//----------------Main Weather Function------------------\\

const Weather = () => {

  //----------------References------------------\\

  const inputRef = useRef();
  const lastQueryRef = useRef("");

   //----------------State Variables------------------\\
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 }); 
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [cityTimezone, setCityTimezone] = useState(0);
  const [units, setUnits] = useState("metric"); // "metric" or "imperial"
  
   //----------------Live Time Update for Clock------------------\\
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); 
    return()=>clearInterval(timer);
  }, []);
  
   //----------------Local City Time Calculation------------------\\
  const getCityTime = () => {
    const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    return new Date(utc + cityTimezone * 1000);
  };

 //----------------Re-fetch Weather for Unit Changes------------------\\
const searchWithUnits = (newUnits) => {
  setUnits(newUnits);
  if (lastQueryRef.current) {
    search(lastQueryRef.current, newUnits);
  }
};
  //----------------Weather Icons Using Own Custom Weather Icons and Weather Icons Code by OpenWeatherMap API------------------\\
  const allIcons = {
    "01d": `https://openweathermap.org/img/wn/01d@2x.png`,
    "01n": `https://openweathermap.org/img/wn/01n@2x.png`,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": cloud_icon,
    "04n": cloud_icon,
    "09d": `https://openweathermap.org/img/wn/10d@2x.png`,
    "09n": `https://openweathermap.org/img/wn/10n@2x.png`,
    "10d": `https://openweathermap.org/img/wn/10d@2x.png`,
    "10n": `https://openweathermap.org/img/wn/10n@2x.png`,
    "11d": `https://openweathermap.org/img/wn/11d@2x.png`,
    "11n": `https://openweathermap.org/img/wn/11n@2x.png`,
    "13d": `https://openweathermap.org/img/wn/13d@2x.png`,
    "13n": `https://openweathermap.org/img/wn/13n@2x.png`,
  };

 //----------------Handler for Autocomplete Input Searches------------------\\
  const handleInputChange = async (e) => {
    const value = e.target.value;
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }
 //----------------Position dropdown below input and specify positions------------------\\
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width
    });
 //----------------Build OpenWeatherMap Geocoding API to fetch city suggestions for autocomplete input------------------\\

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${import.meta.env.VITE_APP_ID}`;
    const res = await fetch(geoUrl);
    const data = await res.json();
    setSuggestions(data);
  };
 //----------------Main asynchronous search function that takes the query, and the units either metric of imperial------------------\\

  const search = async (query,overrideUnits = units) => {
    
     //----------------Check if the query is valid otherwise display error------------------\\
    if (!query) {
      alert("Enter City Name");
      return;
    }

    lastQueryRef.current = query; // Store last query

    try {
      //----------------Build OpenWeatherMap Geocoding API to fetch city names for proper city input [City, State/Province, Country]------------------\\
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${import.meta.env.VITE_APP_ID}`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
     
      //----------------If data location not found------------------\\
      if (!geoData.length) {
        alert("Location not found");
        return;
      }

      //----------------Chooses the best matching city to avoid specific neighbourhoods, districts, etc------------------\\
      let cityResult = geoData.find(loc => loc.type === "city");
      if (!cityResult) {
        geoData.sort((a, b) => (b.population || 0) - (a.population || 0));
        cityResult = geoData[0];
      }
      
      const { lat, lon, name, country, state } = cityResult; //City parameters stated for setWeatherData
    
      //----------------Build OpenWeatherMap API, first for current and general weather information, second for forecast information------------------\\
      //----------------API retrieved: url: Current Weather Data, forecastUrl: 5 Day/3 Hour Forecast------------------\\
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${overrideUnits}&appid=${import.meta.env.VITE_APP_ID}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${overrideUnits}&appid=${import.meta.env.VITE_APP_ID}`;
      //----------------fetch response and waits------------------\\
      const [response, forecastResponse] = await Promise.all([fetch(url), fetch(forecastUrl)]);

      const data = await response.json();
      
      const forecastData = await forecastResponse.json();
      
setHourlyForecast(forecastData.list.slice(0, 8)); // Next 24 hours forecast data (3-hour intervals)

      //----------------If response not found or not ok------------------\\
      if (!response.ok || !forecastResponse.ok) {
        alert("Weather data not found");
        return;
      }

      
      setCityTimezone(data.timezone); //Set timezone

      console.log(data); //printing data 
      
      //variable for what icons to display and display a clear variable on default if not applicable
      const icon = allIcons[data.weather[0].icon] || `https://openweathermap.org/img/wn/01d@2x.png`;

      //----------------Parameters for weather data------------------\\
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: overrideUnits === "metric"
          ? Math.round(data.wind.speed * 3.6) // m/s → km/h
          : Math.round(data.wind.speed),       // mph already
        feels_like: Math.floor(data.main.feels_like),
        pressure: data.main.pressure,
        temperature: Math.floor(data.main.temp),
        location: name,
        state: state,
        country: country,
        icon: icon,
        description: data.weather[0].description,
        temp_min: Math.floor(data.main.temp_min),
        temp_max: Math.floor(data.main.temp_max),
        
      });

      //----------------Map to forecast through 3 hour entries-----------------\\
      const dailyMap = {};

      forecastData.list.forEach(item => {
        const date = toCityDateKey(item.dt, data.timezone);//convert to city local date

        //----------------If it doesnt exist, intialize day entry------------------\\
        if (!dailyMap[date]) {
          dailyMap[date] = {
            tempsMin: [],
            tempsMax: [],
            feels: [],
            weather: item.weather,
            dt: item.dt
          };
        }
        //----------------Collect Temperature Data------------------\\
        dailyMap[date].tempsMin.push(item.main.temp_min);
        dailyMap[date].tempsMax.push(item.main.temp_max);
        dailyMap[date].feels.push(item.main.feels_like);
      });
      const todayKey = toCityDateKey(
      Math.floor(Date.now() / 1000),
      data.timezone
    );
      //----------------Build 5 day forecast array------------------\\
      const dailyForecast = Object.entries(dailyMap)
      .filter(([dateKey]) => dateKey !== todayKey) // remove today
      .slice(0, 5)
      .map(([_, day]) => ({
        dt: day.dt,
        main: {
          temp_min: Math.min(...day.tempsMin),
          temp_max: Math.max(...day.tempsMax),
          feels_like: Math.round(
            day.feels.reduce((a,b)=>a+b,0)/day.feels.length
          )
        },
        weather: day.weather
      }));


      setForecast(dailyForecast); //set forecast to state

      setSuggestions([]); // hide suggestions after search
    
    } catch (error) {
      console.error("Error in fetching weather data", error);//error catch
    }
  };

  return (
    //----------------Whole App Wrapper------------------\\
    <div className="wrapper-weather">  
      <h1 className = "main-title">Weather App</h1>
      {/* -----Current Weather Panel----- */}
      <div className="weather">
        {/* -----Search Bar----- */}
        <div className="search-bar">
          {/* -----Input area----- */}
          <div className = "input-wrapper">
            {/* -----Area to type in search input, able to press enter to search as well----- */}
          <input
            ref={inputRef}
            type="text"
            placeholder="City, Province, Country"
            onChange={handleInputChange}
            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                search(inputRef.current.value);
              }
            }}
          />
          {/* -----To display the x icon at the end of the search bar to clear the current typed search and clear autocomplete suggestions----- */}
          <span className = "clear-x">
          {inputRef.current?.value && inputRef.current.value.length > 0 && (
            <button className = "clear-button" onClick={() => {
              inputRef.current.value = "";
              setSuggestions([]);
            }}>X</button>

          )}
          </span>
          </div>
          {/* -----Display search icon that can be used as clickable search button----- */}
          <img
            src={search_icon}
            alt="search"
            onClick={() => search(inputRef.current.value)}
          />
        </div>

       {/* -----Dropdown Menu: (Will only display the dropdown if the current suggestions array length is at least 1+----- */}
        {suggestions.length > 0 && (
          <div
            className="suggestions-dropdown"
            
            style={{
              position: "absolute",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 10000
            }}
          >
            {/* -----Map of where and what the suggestions will display, such as City, State/Province, Country----- */}
            {/* -----Able to click the item from dropdown and display in input field and then search----- */}
            {suggestions.map((place, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  const text = place.name + (place.state ? `,${place.state}` : "") + `,${place.country}`;
                  inputRef.current.value = text;
                  search(text);
                }}
              >
                {/* -----Display the location name----- */}
                <span className="suggestion-name">{place.name}</span>
                {place.state && <span className="suggestion-state">, {place.state}</span>}
                <span className="suggestion-country">, {place.country}</span>
              </div>
            ))}
          </div>
        )}
        {/* -----Line below means all content apart from search bar will be hidden unless there is something typed in the searchbar or data given----- */}
        {weatherData && <>
          <img src={weatherData.icon} alt="" className="weather-icon" /> {/* -----Displays the weather icon----- */}
          {/* -----Unit Toggling Buttons to Switch from Celsius to Fahrenheit and vice versa----- */}
          <div className="unit-toggle">
            {/* -----Celsius button and change units to metric----- */}
            <button
              className={`unit-btn ${units === "metric" ? "active" : ""}`}
              onClick={() => searchWithUnits("metric")}
            >
              °C
            </button>
            {/* -----Fahrenheit button and change units to imperial----- */}
            <button
              className={`unit-btn ${units === "imperial" ? "active" : ""}`}
              onClick={() => searchWithUnits("imperial")}
            >
              °F
          </button>
        </div>
        {/* -----Displays description of the weather----- */}
          <p className="description" style={{ textTransform: "capitalize" }}> {weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)}</p>
          <br />
          {/* -----Displays temperature and the temperature range (min,max) with respective units----- */}
          <p className="temperature">{weatherData.temperature}°{units === "metric" ? "C" : "F"}</p>
          <p className="temp-range"> &uarr; {weatherData.temp_max}°{units === "metric" ? "C" : "F"} | &darr;  {weatherData.temp_min}°{units === "metric" ? "C" : "F"}</p>
          {/* -----Displays location name (encoded as city), State, and Country----- */}
          <p className="location">{weatherData.location}, {weatherData.state}, {weatherData.country}</p>

          {/* -----Displays the current local time as well as the time in the location's timezone----- */}
          <p className = "current-time">
            Local: {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit',second: '2-digit'})}
            &ensp;||&ensp;
            {weatherData.location} Time: {getCityTime().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', second:'2-digit' })}
            <br /></p>
          {/* -----Displays the current date----- */}
          <p className="current-date" style = {{fontSize: "18px", color: "#fff",opacity: "0.8", marginTop: "5px"}}>
            {getCityTime().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {/* -----Displays secondary data information at bottom of panel such as Feels Like, Pressure, Humidity, and Wind Speed----- */}
          {/* -----Structure goes as: Respective Image -> Unit of measurement -> Text/Label ----- */}
          <div className="weather-data">
            <div className="col">
              <img src={feels_like_icon} alt="" />
              <div>
                <p>{weatherData.feels_like}°{units === "metric" ? "C" : "F"}</p>
                <span>Feels Like</span>
              </div>
            </div>
            <div className="col">
              <img src={pressure_icon} alt="" />
              <div>
                <p>{weatherData.pressure} hPa</p>
                <span>Pressure</span>
              </div>
            </div>
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed}{units === "metric" ? "Km/h" : "mph"} </p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>}

      </div>

      {/* -----Displays the Hourly Forecast Panel. Will display only if there is content or information such as from search input----- */}

      {hourlyForecast.length>0 &&(
      <div className="hourly-forecast-panel">
        <h2 className="hourly-forecast-title">3-Hours Hourly Forecast</h2>
        <HourlyForecast forecast={hourlyForecast} allIcons={allIcons} cityTimezone = {cityTimezone} units = {units} />
      </div>
      )}

      {/* -----Displays the Forecast Panel. Will display only if there is content or information such as from search input----- */}

      {forecast.length>0 &&(
      <div className="forecast-panel">
        <h2 className="forecast-title">5-Day Forecast</h2>
        <Forecast forecast={forecast} allIcons={allIcons} cityTimezone={cityTimezone} units = {units}/>
      </div>
      )}
    </div>
  )
}

export default Weather;