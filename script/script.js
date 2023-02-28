const API_KEY_Whether = "998c29647ddd53b96d983d0b2e338814";
const API_KEY_Ip = "at_lcoKCaOfoP0gGmVEWbmAvt6Kk7FEK&";
const weatherCard = document.querySelector(".weather");
const weatherHere = document.querySelector(".header__title");

findLocation();

function ucFirst(str) {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
}

async function getCityByIP(key) {
  let res = await fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=${key}`
  );
  return res.json();
}

async function getCordsByIP() {
  const ipLocation = await getCityByIP(API_KEY_Ip);
  const { lat, lng } = ipLocation.location;
  const cords = { lng, lat };
  return cords;
}

async function fetchWeatherCords(lat, lon, key) {
  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
  );
  return res.json();
}

async function fetchWeatherCity(city, key) {
  try {
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
    );
    const dataWetherByCity = await res.json();
    if (!dataWetherByCity.message) weatherCardDrow(dataWetherByCity);
    throw dataWetherByCity;
  } catch (err) {
    if (err.message.length) {
      errorCardDrow(ucFirst(err.message));
    } else weatherCardDrow(err);
  }
}

function findLocation() {
  if (!navigator.geolocation) {
    error();
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
  async function success(position) {
    const { longitude, latitude } = position.coords;
    const dataWether = await fetchWeatherCords(
      latitude,
      longitude,
      API_KEY_Whether
    );
    console.log(dataWether);
    weatherCardDrow(dataWether);
  }
}

async function error() {
  try {
    const { lng, lat } = await getCordsByIP();
    const dataWether = await fetchWeatherCords(lat, lng, API_KEY_Whether);
    weatherCardDrow(dataWether);
  } catch (err) {
    cityCardDrow();
  }
}

function weatherCardDrow(data) {
  const temperture = Math.round(data.main.temp);
  const locationName = data.name;
  const weatherDiscription = data.weather[0].description;
  const ucFirstWeatherDiscription = ucFirst(weatherDiscription);
  weatherCard.innerHTML = `<p class="weather__temperature"> ${temperture}°C </p>
     <p class="weather__text" > ${ucFirstWeatherDiscription} in ${locationName} </p >
     <a class="weather__city">Change city</a>`;
  const changeCityButton = weatherCard.querySelector(".weather__city");
  changeCityButton.addEventListener("click", cityCardDrow);
}

function cityCardDrow() {
  weatherCard.innerHTML = `<form class="weather">
        <input
          type="text"
          placeholder="Type your city here"
          class="weather__input"
        />
        <button class="weather__submit">Find</button>
        </form>`;
  const form = weatherCard.querySelector(".weather");
  const input = weatherCard.querySelector(".weather__input");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const cityName = input.value;
    if (input.value.trim().length) {
      fetchWeatherCity(cityName, API_KEY_Whether);
    } else {
      input.placeholder = "Input is empty, type your city";
    }
  });
}

function errorCardDrow(err) {
  weatherCard.innerHTML = `<p class="weather__error">Ooops. Something went wrong.</p>
        <p class="weather__info">${err}</p>
        <button class="weather__submit">Try again</button>`;
  const tryAgainButton = weatherCard.querySelector(".weather__submit");
  tryAgainButton.addEventListener("click", findLocation);
}

weatherHere.addEventListener("click", findLocation);
