// 🔑 API-ключ для WeatherAPI
const API_KEY = "e8b227f41dfb47fb9bf133323253105";

// Получаем элементы DOM
const input = document.getElementById("cityInput"); // поле ввода города
const suggestionsBox = document.querySelector(".suggestions"); // блок для автоподсказок
const errorMsg = document.getElementById("error-message"); // блок для вывода ошибок

// 📥 Обработка ввода текста в поле города
input.addEventListener("input", () => {
    const query = input.value.trim(); // удаляем пробелы
    if (query.length < 2) {
        suggestionsBox.innerHTML = ""; // очищаем подсказки, если ввели меньше 2 символов
        return;
    }

    // 🌐 Запрос к WeatherAPI для поиска подходящих городов
    fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`)
        .then(res => res.json())
        .then(data => {
            suggestionsBox.innerHTML = ""; // очищаем предыдущие подсказки

            // Добавляем новые подсказки
            data.forEach(location => {
                const suggestion = document.createElement("div");
                suggestion.className = "suggestion";
                suggestion.textContent = `${location.name}, ${location.country}`;

                    // При выборе подсказки — обновляем поле и загружаем погоду
                suggestion.addEventListener("click", () => {
                    input.value = location.name;
                    suggestionsBox.innerHTML = "";
                    getWeather(location.name);
                });

                suggestionsBox.appendChild(suggestion);
            });
        });
});

// 🌤️ Функция загрузки погоды по городу (по умолчанию — Київ)
function getWeather(city = "Kyiv") {
    const URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`;

    fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Місто не знайдено"); // если ошибка — бросаем исключение
            }
            return response.json();
        })
        .then((data) => {
            // Скрываем сообщение об ошибке и отображаем погоду
            errorMsg.style.display = "none";
            document.querySelector(".current-weather").style.display = "flex";
            document.querySelector(".details").style.display = "grid";

            // 🏙️ Название города и страны
            document.getElementById("city").textContent = `${data.location.name}, ${data.location.country}`;

            // 🕒 Локальное время города
            const localTime = new Date(data.location.localtime);
            document.getElementById("local-time").textContent = localTime.toLocaleTimeString("uk-UA", {
                hour: "2-digit",
                minute: "2-digit"
            });

            // 📅 Текущая дата
            const now = new Date();
            document.getElementById("date").textContent = now.toLocaleDateString("uk-UA", {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            // 🌡️ Отображение текущей погоды
            document.getElementById("icon").src = `https:${data.current.condition.icon}`;
            document.getElementById("desc").textContent = data.current.condition.text;
            document.getElementById("temp").textContent = `${data.current.temp_c} °C`;
            document.getElementById("wind").textContent = (data.current.wind_kph / 3.6).toFixed(1); // м/с
            document.getElementById("humidity").textContent = data.current.humidity;

            // 🎨 Изменение фона в зависимости от состояния погоды
            const app = document.querySelector(".app");
            const condition = data.current.condition.text.toLowerCase();

            

            // 📆 Прогноз на ближайшие 5 дней
            let forecast = document.querySelector('.forecast');
            forecast.innerHTML = ''; // очищаем блок прогноза

            data.forecast.forecastday.forEach((day) => {
                forecast.innerHTML += `
                  <div class="day">
                      <p>${day.date}</p>
                      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                      <span>${day.day.avgtemp_c} °C</span>
                  </div>
                `;
            });

            // 🕐 Погодинний прогноз на сьогодні (до 24 годин) с деталями
            let hourlyContainer = document.getElementById("hourly-container");
            hourlyContainer.innerHTML = "";

            data.forecast.forecastday[0].hour.forEach(hourData => {
                const time = new Date(hourData.time).getHours().toString().padStart(2, '0') + ":00";
                const windMs = (hourData.wind_kph / 3.6).toFixed(1); // км/ч в м/с
                const humidity = hourData.humidity;
                const conditionText = hourData.condition.text;

                hourlyContainer.innerHTML += `
                    <div class="hour-block">
                        <p>${time}</p>
                        <img src="https:${hourData.condition.icon}" alt="${conditionText}" />
                        <p>${hourData.temp_c} °C</p>
                        <p>Вітер: ${windMs} м/с</p>
                        <p>Вологість: ${humidity}%</p>
                        <p>${conditionText}</p>
                    </div>
                `;
            });

        })
        .catch((error) => {
            // ❌ В случае ошибки: показываем сообщение и скрываем данные
            errorMsg.textContent = "Місто не знайдено. Спробуйте інше.";
            errorMsg.style.display = "block";
            document.getElementById("city").textContent = "Невідоме місто";
            document.querySelector(".current-weather").style.display = "none";
            document.querySelector(".details").style.display = "none";
            document.querySelector(".forecast").innerHTML = '';
            document.getElementById("local-time").textContent = "--:--";
        });
}

// 🚀 Стартовое отображение погоды по умолчанию
getWeather();
