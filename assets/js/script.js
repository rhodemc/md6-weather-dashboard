const openWeatherApiKey = "a55e288f2369d40b8ca8752af6111df3";

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
      <button class = "border-2 w-64 h-10 rounded border-slate-600 bg-slate-200 text-center searchHistoryItem">${cityInput}</button></br>
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

      let currentDayEl = document.querySelector("#currentDay");
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
  let baseUrl = `https://api.openweathermap.org/data/2.5/${path}`;
  let fullUrl = baseUrl + "?q=" + cityInput.replace(/\s/g, "%20") + "&units=imperial&appid=" + openWeatherApiKey;
  return fullUrl;
}

// five day forecast
function fiveDayForecast(cityInput, forecastResults) {
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
      $(".fiveDay").empty();

      for (let i = 0; i < forecastResults.list.length; i = i + 8) {
        let cityData = {
          date: forecastResults.list[i].dt_txt,
          icon: forecastResults.list[i].weather[0].icon,
          temp: forecastResults.list[i].main.temp,
          wind: forecastResults.list[i].wind.speed,
          humidity: forecastResults.list[i].main.humidity,
        };

        let forecastDate = dayjs(cityData.date).format("MM/DD/YYYY");
        let iconUrl = `<img src="https://openweathermap.org/img/w/${cityData.icon}.png" alt="${forecastResults.list[i].weather[0].description}" />`;

        let forecastCard = $(`
            <div class="mx-auto mt-2 rounded w-36 h-48 bg-blue-400 text-slate-200">
                <h4 class="pl-1 my-1">${forecastDate}</h4>
                <p class="pl-1 mb-2">${iconUrl}</p>
                <p class="pl-1 mb-2">Temp: ${cityData.temp} *F</p>
                <p class="pl-1 mb-2">Wind: ${cityData.wind} MPH</p>
                <p class="pl-1 mb-2">Humidity: ${cityData.humidity}\%</p>
        `);
        $(".fiveDay").append(forecastCard);
      }
    });
}

// click on a city in the search history to be presented with weather
$(document).on("click", ".searchHistoryItem", function () {
  let cityList = $(this).text();
  searchOpenWeatherApi(cityList);
  fiveDayForecast(cityList);
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
      <button class = "border-2 w-64 h-10 rounded border-slate-600 bg-slate-200 searchHistoryItem">${savedCity}</button></br>
      `);
      $("#searchHistory").append(searchedCity);
    });
  }
});
