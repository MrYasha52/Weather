// 🔑 API-ключ для WeatherAPI
const API_KEY = "e8b227f41dfb47fb9bf133323253105";

// Получаем элементы DOM
const input = document.getElementById("cityInput");
const suggestionsBox = document.querySelector(".suggestions");
const errorMsg = document.getElementById("error-message");
const cityElem = document.getElementById("city");
const iconElem = document.getElementById("icon");
const descElem = document.getElementById("desc");
const tempElem = document.getElementById("temp");
const windElem = document.getElementById("wind");
const humidityElem = document.getElementById("humidity");
const forecastElem = document.querySelector(".forecast");
const hourlyContainer = document.getElementById("hourly-container");
const localTimeElem = document.getElementById("local-time");
const dateElem = document.getElementById("date");

// 📥 Обработка ввода текста в поле города
input.addEventListener("input", () => {
  const query = input.value.trim();
  if (query.length < 2) {
    suggestionsBox.innerHTML = "";
    errorMsg.style.display = "none";  // прячем ошибку
    return;
  }

  fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`)
    .then((res) => res.json())
    .then((data) => {
      suggestionsBox.innerHTML = "";
      if (!data.length) {
        // Если город не найден
        errorMsg.textContent = "Місто не знайдено. Спробуйте інше.";
        errorMsg.style.display = "block";
        cityElem.textContent = "Невідоме місто";
        document.querySelector(".current-weather").style.display = "none";
        document.querySelector(".details").style.display = "none";
        forecastElem.innerHTML = "";
        localTimeElem.textContent = "--:--";
        return;
      } else {
        errorMsg.style.display = "none";
      }

      data.forEach((location) => {
        const suggestion = document.createElement("div");
        suggestion.className = "suggestion";
        suggestion.textContent = `${location.name}, ${location.country}`;
        suggestion.addEventListener("click", () => {
          input.value = location.name;
          suggestionsBox.innerHTML = "";
          getWeather(location.name);
        });
        suggestionsBox.appendChild(suggestion);
      });
    })
    .catch(() => {
      // Если ошибка запроса к API
      errorMsg.textContent = "Помилка сервера. Спробуйте пізніше.";
      errorMsg.style.display = "block";
    });
});

function getWeather(city = "Kyiv") {
  const URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`;

  fetch(URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Місто не знайдено");
      }
      return response.json();
    })
    .then((data) => {
      errorMsg.style.display = "none";
      document.querySelector(".current-weather").style.display = "flex";
      document.querySelector(".details").style.display = "grid";

      cityElem.textContent = `${data.location.name}, ${data.location.country}`;

      const localTime = new Date(data.location.localtime);
      localTimeElem.textContent = localTime.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const now = new Date();
      dateElem.textContent = now.toLocaleDateString("uk-UA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      iconElem.src = `https:${data.current.condition.icon}`;
      descElem.textContent = data.current.condition.text;
      tempElem.textContent = `${data.current.temp_c} °C`;
      windElem.textContent = (data.current.wind_kph / 3.6).toFixed(1);
      humidityElem.textContent = data.current.humidity;

      // 🎨 Фоновое оформление по погоде
      const condition = data.current.condition.text.toLowerCase();
      const app = document.querySelector(".app");
      if (condition.includes("rain") || condition.includes("дощ")) {
        app.style.backgroundColor = "#cce7ff";
      } else if (condition.includes("sun") || condition.includes("сонце")) {
        app.style.backgroundColor = "#fff5cc";
      } else if (condition.includes("snow") || condition.includes("сніг")) {
        app.style.backgroundColor = "#eef6f9";
      } else if (condition.includes("cloud") || condition.includes("хмар")) {
        app.style.backgroundColor = "#d3d3d3";
      } else {
        app.style.backgroundColor = "#f0f4f8";
      }

      forecastElem.innerHTML = "";
      data.forecast.forecastday.forEach((day) => {
        forecastElem.innerHTML += `
          <div class="day">
              <p>${day.date}</p>
              <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
              <span>${day.day.avgtemp_c} °C</span>
          </div>
        `;
      });

      hourlyContainer.innerHTML = "";
      data.forecast.forecastday[0].hour.forEach((hourData) => {
        const time = new Date(hourData.time).getHours().toString().padStart(2, "0") + ":00";
        hourlyContainer.innerHTML += `
          <div class="hour-block">
            <p>${time}</p>
            <img src="https:${hourData.condition.icon}" alt="${hourData.condition.text}" />
            <p>${hourData.temp_c} °C</p>
            <p>Вітер: ${(hourData.wind_kph / 3.6).toFixed(1)} м/с</p>
            <p>Вологість: ${hourData.humidity}%</p>
            <p>${hourData.condition.text}</p>
          </div>
        `;
      });
    })
    .catch((error) => {
      errorMsg.textContent = "Місто не знайдено. Спробуйте інше.";
      errorMsg.style.display = "block";
      cityElem.textContent = "Невідоме місто";
      document.querySelector(".current-weather").style.display = "none";
      document.querySelector(".details").style.display = "none";
      forecastElem.innerHTML = "";
      localTimeElem.textContent = "--:--";
    });
}

// 🚀 Початковий виклик
getWeather();
