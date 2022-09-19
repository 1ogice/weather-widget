let api = "b98c0b7f365379e61f86e7da30e4ed56";

let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
let daysOfWeek = [firstDay, secondDay, thirdDay, fourthDay];

function logDaysOfWeek(day) {
  let date = new Date();
  day = date.getDay();

  let res = days[day];

  for (
    let i = days.indexOf(res), j = 0;
    i < 11, j < daysOfWeek.length;
    i++, j++
  ) {
    dayOfWeek = daysOfWeek[j];
    let res = days[(i + 1) % days.length];
    dayOfWeek.innerHTML = `${res}`;
  }
}
logDaysOfWeek();

function iconURL(icon) {
  let iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  return iconURL;
}

function APIcall(res) {
  icon = res.data.weather[0].icon;
  mainIcon.src = iconURL(icon);
  currentWeather.innerHTML = res.data.weather[0].main;
  currentTemp.innerHTML = res.data.main.temp.toFixed(0);
  currentFLTemp.innerHTML = res.data.main.feels_like.toFixed(0);
  mainCity.innerHTML = res.data.name;
  mainCountry.innerHTML = res.data.sys.country;
  selectedLocation.innerHTML = res.data.name;
}

function setDaysWeatherInfo(list) {
  for (let i = 1; i < 5; i++) {
    window["DayWeatherDescription_" + `${i}`].innerHTML =
      list[i].weather[0].main;
    icon = list[i].weather[0].icon;
    window["DayImg_" + `${i}`].src = iconURL(icon);
    window["DayMaxTemp_" + `${i}`].innerHTML = list[i].main.temp_max.toFixed(0);
    window["DayMinTemp_" + `${i}`].innerHTML = list[i].main.temp_min.toFixed(0);
  }
}

function filterData(list) {
  list = list
    .map((item) => {
      if (item.dt_txt.includes("12:00:00")) {
        return item;
      }
    })
    .filter((item) => {
      return item !== undefined;
    });
}

function forecastURL(city, api) {
  let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=40&appid=${api}&units=metric`;
  return forecastURL;
}

function getCalledWeather() {
  city = search.value;

  let calledWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api}`;

  axios.get(calledWeatherURL).then((res) => {
    APIcall(res);

    axios.get(forecastURL(city, api)).then((result) => {
      let list = result.data.list;
      filterData(list);
      setDaysWeatherInfo(list);
    });
  });
}

function getCurrentWeather() {
  navigator.geolocation.getCurrentPosition((position) => {
    let posURL = `https://api.openweathermap.org/data/2.5/weather?lat=${+position.coords.latitude.toFixed(
      2
    )}&lon=${+position.coords.longitude.toFixed(2)}&units=metric&appid=${api}`;

    axios.get(posURL).then((res) => {
      city = res.data.name;
      APIcall(res);

      axios.get(forecastURL(city, api)).then((result) => {
        let list = result.data.list;
        filterData(list);
        setDaysWeatherInfo(list);
      });
    });
  });
}
getCurrentWeather();

function cancelEnterKey() {
  search.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  });
}
cancelEnterKey();
