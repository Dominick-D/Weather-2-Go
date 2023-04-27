// Constants
const API_KEY = "b59eb732e3ed9ed1e577677600af1ab6";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/";

// DOM elements
const formEl = document.querySelector("form");
const inputEl = document.querySelector("input[type=text]");
const currentWeatherEl = document.querySelector("#current-weather-info");
const forecastEl = document.querySelector("#forecast-info");
const searchHistoryEl = document.querySelector("#search-history");

// State variables
let currentCity = "";
let searchHistory = [];

// Functions
function getCurrentWeather(city) {
  fetch(`${API_BASE_URL}weather?q=${city}&appid=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      const weatherInfo = {
        city: data.name,
        date: new Date(),
        icon: data.weather[0].icon,
        temp: (data.main.temp - 273.15) * 9/5 + 32,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      };

      renderCurrentWeather(weatherInfo);
      getFiveDayForecast(data.coord.lat, data.coord.lon);
      saveSearchHistory(city);
    })
    .catch((error) => console.error(error));
}
function getFiveDayForecast(lat, lon) {
  fetch(`${API_BASE_URL}forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      const forecastInfo = [];

      for (let i = 0; i < data.list.length; i += 8) {
        const dayData = data.list[i];
        forecastInfo.push({
          date: new Date(dayData.dt * 1000),
          icon: dayData.weather[0].icon,
          temp: (dayData.main.temp - 273.15) * 9/5 + 32, //kelvin to F
          humidity: dayData.main.humidity,
          windSpeed: dayData.wind.speed,
        });
      }

      renderForecast(forecastInfo);
    })
    .catch((error) => console.error(error));
}
function renderCurrentWeather(weatherInfo) {
  const temp = weatherInfo.temp.toFixed(2);
  currentWeatherEl.innerHTML = `
    <div class="current-weather-card">
      <h3>${weatherInfo.city} (${weatherInfo.date.toLocaleDateString()})</h3>
      <img src="https://openweathermap.org/img/w/${weatherInfo.icon}.png" alt="${weatherInfo.icon}">
      <p>Temperature: ${temp} °F</p>
      <p>Humidity: ${weatherInfo.humidity}%</p>
      <p>Wind Speed: ${weatherInfo.windSpeed} MPH</p>
    </div>
  `;
}
function renderForecast(forecastInfo) {
  forecastEl.innerHTML = "";
  for (let i = 0; i < forecastInfo.length; i++) {
    const dayData = forecastInfo[i];
    forecastEl.innerHTML += `
      <div class="forecast-card">
        <h4>${dayData.date.toLocaleDateString()}</h4>
        <img src="https://openweathermap.org/img/w/${dayData.icon}.png" alt="${dayData.icon}">
        <p>Temperature: ${dayData.temp} °F</p>
        <p>Humidity: ${dayData.humidity}%</p>
        <p>Wind Speed: ${dayData.windSpeed} MPH</p>
      </div>
    `;
  }
}
function saveSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    const option = document.createElement("a");
    option.classList.add("dropdown-item");
    option.innerText = city;
    option.addEventListener("click", () => {
      inputEl.value = city;
      formEl.dispatchEvent(new Event("submit"));
    });
    searchHistoryEl.appendChild(option);
  }
}

function loadSearchHistory() {
  const searchHistoryEl = document.querySelector("#search-history");
  searchHistoryEl.innerHTML = "";
  searchHistory.forEach((city) => {
    const option = document.createElement("a");
    option.classList.add("dropdown-item");
    option.innerText = city;
    option.addEventListener("click", () => {
      inputEl.value = city;
      formEl.dispatchEvent(new Event("submit"));
    });
    searchHistoryEl.appendChild(option);
  });
}



// Events
formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = inputEl.value.trim();
    if (city) {
    currentCity = city;
    getCurrentWeather(city);
    inputEl.value = "";
    }
    });
    
searchHistoryEl.addEventListener("click", (event) => {
    event.preventDefault();
    const city = event.target.innerText;
    if (city) {
    currentCity = city;
    getCurrentWeather(city);
    }
    });
    
// Initialization
loadSearchHistory();
getCurrentWeather("New York");
    