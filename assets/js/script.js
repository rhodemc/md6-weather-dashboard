const openWeatherApiKey = "a55e288f2369d40b8ca8752af6111df3";

const currentDayEl = document.querySelector("#currentDay");

let currentDayIcon = document.querySelector("#weatherIcon");

let today = dayjs().format("MM/DD/YYYY");
let searchHistoryList = [];

// search button click, starts search and save functions
$(".searchBtn").on("click", function (event) {
  event.preventDefault();

  let cityInput = $("#cityInput").val().trim();

  if (!cityInput) {
    console.error("You need a to input a city!");
    return;
  }

  if (!searchHistoryList.includes(cityInput)) {
    searchHistoryList.push(cityInput);
    let searchedCity = $(`
      <li class = "SearchHistoryItem">${cityInput}</li>
      `);
    $("#searchHistory").append(searchedCity);
  }

  localStorage.setItem("cities", JSON.stringify(searchHistoryList));
  searchOpenWeatherApi(cityInput);
  fiveDayForecast(cityInput);
});

// search for current day weather
function searchOpenWeatherApi(cityInput) {
  let weatherUrl = getUrl("weather", cityInput);

  console.log(weatherUrl);

  fetch(weatherUrl)
    .then(function (response) {
      console.log(response);
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (locWeatherResults) {
      console.log(locWeatherResults);
      //   let iconCode = locWeatherResults.weather[0].icon;
      //   let iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

      let tempEl = document.querySelector("#temp");
      let windEl = document.querySelector("#wind");
      let humidityEl = document.querySelector("#humidity");
      currentDayEl.textContent = locWeatherResults.name + " (" + today + ") ";
      tempEl.textContent = "Temp: " + locWeatherResults.main.temp + " *F";
      windEl.textContent = "Wind: " + locWeatherResults.wind.speed + " MPH";
      humidityEl.textContent = "Humidity: " + locWeatherResults.main.humidity + " %";
    });
}

function getUrl(path, cityInput) {
  let baseUrl = `http://api.openweathermap.org/data/2.5/${path}`;
  let fullUrl = baseUrl + "?q=" + cityInput.replace(/\s/g, "%20") + "&units=imperial&appid=" + openWeatherApiKey;
  return fullUrl;
}

// five day forecast
function fiveDayForecast(cityInput) {
  let forecastUrl = getUrl("forecast", cityInput);

  fetch(forecastUrl)
    .then(function (response) {
      console.log(response);
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (forecastResults) {
      console.log(forecastResults);
    });
}

// click on a city in the search history to be presented with weather
$(document).on("click", ".searchHistoryItem", function () {
  let cityList = $(this).text();
  searchOpenWeatherApi(cityList);
});

// on reload, loads last city searched
$(document).ready(function () {
  let searchHistoryArr = JSON.parse(localStorage.getItem("cities"));
  console.log(searchHistoryArr);

  if (searchHistoryArr) {
    let cityIndex = searchHistoryArr.length - 1;
    let lastCitySearched = searchHistoryArr[cityIndex];
    searchOpenWeatherApi(lastCitySearched);
    fiveDayForecast(lastCitySearched);
    console.log(`Last searched city: ${lastCitySearched}`);

    searchHistoryArr.forEach(function (savedCity) {
      let searchedCity = $(`
      <li class = "SearchHistoryItem">${savedCity}</li>
      `);
      $("#searchHistory").append(searchedCity);
    });
  }
});
