const API_KEY_Whether = "998c29647ddd53b96d983d0b2e338814";
const API_KEY_Ip = "at_lcoKCaOfoP0gGmVEWbmAvt6Kk7FEK&";
const weatherCard = document.querySelector(".weather");

findLocation();

async function getCityByIP(key) {
  let res = await fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=at_lcoKCaOfoP0gGmVEWbmAvt6Kk7FEK&ipAddress=8.8.8.8`
  );
  return res.json();
}
getCordsByIP();

async function getCordsByIP() {
  const ipLocation = await getCityByIP(API_KEY_Ip);
  const { lat, lng } = ipLocation.location;
  const cords = { lng, lat };
  console.log(cords);
  return cords;
}

console.log(getCityByIP());

async function fetchWeatherCords(lat, lon, key) {
  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
  );
  return res.json();
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
    weatherCardDrow(dataWether);
    console.log(dataWether);
  }
}

async function error() {
  try {
    const { lng, lat } = await getCordsByIP();
    const dataWether = await fetchWeatherCords(lat, lng, API_KEY_Whether);
    console.log(dataWether);
    weatherCardDrow(dataWether);
  } catch (err) {
    console.log(err);
  }
}

function weatherCardDrow(data) {
  const temperture = Math.round(data.main.temp);
  const locationName = data.name;
  const weatherDiscription = data.weather[0].main;
  weatherCard.innerHTML = `<p class="weather__temperature"> ${temperture}°C </p>
     <p class="weather__text" > ${weatherDiscription} in ${locationName} </p >
     <a href="" class="weather__city">Change city</a>`;
  console.log(temperture, locationName, weatherDiscription);
}
