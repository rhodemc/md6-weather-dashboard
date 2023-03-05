const openWeatherApiKey = "a55e288f2369d40b8ca8752af6111df3";

const currentDayEl = document.querySelector("#currentDay");

let today = dayjs().format("MM/DD/YYYY");
let searchHistoryList = [];
let city;

// api key = api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// function getWeatherParams() {

//     let searchParamsArr = location.search.split("&");
//     console.log(searchParamsArr);

//     let city = searchParamsArr[0].split("=").pop();

//     console.log(city);

//     searchOpenWeatherApi(city);
//     console.log(searchOpenWeatherApi);
// };

$(".searchBtn").on("click", function (event) {
  event.preventDefault();

  let cityInput = $("#cityInput").val().trim();
  if (!cityInput) {
    console.error("You need a to input a city!");
    return;
  }
  localStorage.setItem("city", JSON.stringify(cityInput));
  searchOpenWeatherApi(city);
});

function searchOpenWeatherApi(city) {
  let queryUrl = "http://api.openweathermap.org/data/2.5/weather";
  let cityInputEl = document.querySelector("#cityInput").value;

  queryUrl = queryUrl + "?q=" + cityInputEl.replace(/\s/g, "%20") + "&units=imperial&appid=" + openWeatherApiKey;

  console.log(queryUrl);

  fetch(queryUrl)
    .then(function (response) {
      console.log(response);
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (locWeatherResults) {
      currentDayEl.textContent = locWeatherResults.name + " (" + today + ")";
      console.log(locWeatherResults);
    });
}

// // current weather
// function currentWeather(city) {
//     let qeuryURL = `api.openweathermap.org/data/2.5/weather?q={city}&units=imperial&appid={openWeatherApiKey}
// };

// // Save search items
// $(".searchBtn").on("click", function (event) {
//   event.preventDefault();

//   let cityInput = $(".cityInput").val().trim();
//   if (!cityInput) {
//     console.error("You need a to input a city!");
//     return;
//   }
//   localStorage.setItem("city", JSON.stringify(cityInput));
//   console.log(searchHistoryList);
//   //   printSearch();
// });

// // function printSearch() {
// //   let searchHistory = localStorage.getItem("city", "");
// //   let searchListItem = document.querySelector(".searchList");
// //   searchListItem.classList.add("li", "bg-slate-200", "mb-3", "pl-3");

// //   let searchHistoryBody = document.createElement("div");
// //   searchHistoryBody.classList.add("card-body");
// //   searchListItem.append(searchHistoryBody);
// // }

// // On reload, presented with last searched city forecast
// // $(document).ready(function () {
// //   let searchHistoryArr = JSON.parse(localStorage.getItem("city"));

// //   if (searchHistoryArr !== null) {
// //     let lastSearchedIndex = searchHistoryArr.length - 1;
// //     let lastSearchedCity = searchHistoryArr[lastSearchedIndex];
// //     console.log(`Last searched city: ${searchHistoryArr}`);
// //   }
// // });
