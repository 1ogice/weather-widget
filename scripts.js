let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
let daysOfWeek = [firstDay, secondDay, thirdDay, fourthDay];
let nameOfTheTown = "London";
let api = "b98c0b7f365379e61f86e7da30e4ed56";
let day = getWeekDay();

search.addEventListener("keydown", function (event) {
  if (event.keyCode == 13) {
    event.preventDefault();
  }
});

for (
  let i = days.indexOf(day), j = 0;
  i < 11, j < daysOfWeek.length;
  i++, j++
) {
  dayOfWeek = daysOfWeek[j];
  let day = days[(i + 1) % days.length];
  dayOfWeek.innerHTML = `${day}`;
}

function APIcall(res) {
  let icon = res.data.weather[0].icon;
  let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  mainIcon.src = iconUrl;
  currentWeather.innerHTML = res.data.weather[0].main;
  currentTemp.innerHTML = res.data.main.temp.toFixed(0);
  currentFLTemp.innerHTML = res.data.main.feels_like.toFixed(0);
  mainCity.innerHTML = res.data.name;
  mainCountry.innerHTML = res.data.sys.country;
  selectedLocation.innerHTML = res.data.name;
}
function getNum() {
  let date = new Date();
  date = date.getDate();

  return date;
}

function changeInfo(list) {
  firstDayWeatherDescription.innerHTML = list[1].weather[0].main;
  let icon = list[1].weather[0].icon;
  let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  firstDayImg.src = iconUrl;
  firstDayMaxTemp.innerHTML = list[1].main.temp_max.toFixed(0);
  firstDayMinTemp.innerHTML = list[1].main.temp_min.toFixed(0);

  secondDayWeatherDescription.innerHTML = list[2].weather[0].main;
  icon = list[2].weather[0].icon;
  iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  secondDayImg.src = iconUrl;
  secondDayMaxTemp.innerHTML = list[2].main.temp_max.toFixed(0);
  secondDayMinTemp.innerHTML = list[2].main.temp_min.toFixed(0);

  thirdDayWeatherDescription.innerHTML = list[3].weather[0].main;
  icon = list[3].weather[0].icon;
  iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  thirdDayImg.src = iconUrl;
  thirdDayMaxTemp.innerHTML = list[3].main.temp_max.toFixed(0);
  thirdDayMinTemp.innerHTML = list[3].main.temp_min.toFixed(0);

  fourthDayWeatherDescription.innerHTML = list[4].weather[0].main;
  icon = list[4].weather[0].icon;
  iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  fourthDayImg.src = iconUrl;
  fourthDayMaxTemp.innerHTML = list[4].main.temp_max.toFixed(0);
  fourthDayMinTemp.innerHTML = list[4].main.temp_min.toFixed(0);
}

function getWeekDay(day) {
  let date = new Date();

  day = date.getDay();

  return days[day];
}

function getCalledWeather(city) {
  city = search.value;
  let firstUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${api}`;
  axios.get(firstUrl).then((res, lat, lon) => {
    if (!res.data.length) {
      alert("invalid value");
    }
    lat = +res.data[0].lat.toFixed(2);
    lon = +res.data[0].lon.toFixed(2);

    let secondUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api}`;

    axios.get(secondUrl).then((res) => {
      APIcall(res);
      let nextUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=40&appid=${api}&units=metric`;

      axios.get(nextUrl).then((result) => {
        // let date = getNum();
        // console.log(date);
        // console.log(result.data.list[0].dt_txt);
        let list = result.data.list;
        list = list
          .map((item) => {
            if (item.dt_txt.includes("12:00:00")) {
              return item;
            }
          })
          .filter((item) => {
            return item !== undefined;
          });
        // console.log(list);
        changeInfo(list);
      });
    });
  });
}

function getCurrentWeather() {
  let lat, lon;

  navigator.geolocation.getCurrentPosition(function (position) {
    lat = +position.coords.latitude.toFixed(2);
    lon = +position.coords.longitude.toFixed(2);

    let thirdUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api}`;

    axios.get(thirdUrl).then((res) => {
      let city = res.data.name;
      APIcall(res);
      let nextUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=40&appid=${api}&units=metric`;

      axios.get(nextUrl).then((result) => {
        // let date = getNum();
        // console.log(date);
        // console.log(result.data.list[0].dt_txt);
        let list = result.data.list;
        list = list
          .map((item) => {
            if (item.dt_txt.includes("12:00:00")) {
              return item;
            }
          })
          .filter((item) => {
            return item !== undefined;
          });
        // console.log(list);
        changeInfo(list);
      });
    });
  });
}
getCurrentWeather();
