const API_KEY = "e8b227f41dfb47fb9bf133323253105";
const input = document.getElementById("cityInput");
const suggestionsBox = document.querySelector(".suggestions");
const errorMsg = document.getElementById("error-message");
const hourlyContainer = document.getElementById("hourly-container");

let localOffsetMinutes = 0;

function updateLiveLocalTime() {
    const now = new Date();
    const local = new Date(now.getTime() + localOffsetMinutes * 60000);
    document.getElementById("local-time").textContent = local.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit"
    });
}
setInterval(updateLiveLocalTime, 60000);

input.addEventListener("input", () => {
    const query = input.value.trim();
    if (query.length < 2) {
        suggestionsBox.innerHTML = "";
        return;
    }

    fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`)
        .then(res => res.json())
        .then(data => {
            suggestionsBox.innerHTML = "";
            data.forEach(location => {
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

            document.getElementById("city").textContent = `${data.location.name}, ${data.location.country}`;
            const localTime = new Date(data.location.localtime);
            localOffsetMinutes = (localTime - new Date()) / 60000;
            updateLiveLocalTime();

            const now = new Date();
            document.getElementById("date").textContent = now.toLocaleDateString("uk-UA", {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            document.getElementById("icon").src = `https:${data.current.condition.icon}`;
            document.getElementById("desc").textContent = data.current.condition.text;
            document.getElementById("temp").textContent = `${data.current.temp_c} °C`;
            document.getElementById("wind").textContent = (data.current.wind_kph / 3.6).toFixed(1);
            document.getElementById("humidity").textContent = data.current.humidity;
            document.getElementById("precip").textContent = data.current.precip_mm.toFixed(1);

            const app = document.querySelector(".app");
            const condition = data.current.condition.text.toLowerCase();
            if (condition.includes("sunny") || condition.includes("clear")) {
                app.style.backgroundColor = "#fff7d6";
            } else if (condition.includes("rain")) {
                app.style.backgroundColor = "#d6ecff";
            } else if (condition.includes("cloud") || condition.includes("overcast")) {
                app.style.backgroundColor = "#e2e8f0";
            } else {
                app.style.backgroundColor = "#f0f4f8";
            }

            // Прогноз на 5 днів
            let forecast = document.querySelector('.forecast');
            forecast.innerHTML = '';
            data.forecast.forecastday.forEach((day) => {
                forecast.innerHTML += `
                  <div class="day">
                      <p>${day.date}</p>
                      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                      <span>${day.day.avgtemp_c} °C</span>
                  </div>
                `;
            });

            // Погода по годинах
            hourlyContainer.innerHTML = "";
            const todayHours = data.forecast.forecastday[0].hour;
            todayHours.forEach(hourData => {
                const time = new Date(hourData.time).toLocaleTimeString("uk-UA", {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const icon = hourData.condition.icon;
                const temp = hourData.temp_c;
                const wind = (hourData.wind_kph / 3.6).toFixed(1);
                const humidity = hourData.humidity;
                const precip = hourData.precip_mm;

                const hourElem = document.createElement("div");
                hourElem.className = "hour";
                hourElem.innerHTML = `
                    <p>${time}</p>
                    <img src="https:${icon}" alt="icon" width="36">
                    <p>🌡 ${temp} °C</p>
                    <p>💨 ${wind} м/с</p>
                    <p>💧 ${humidity}%</p>
                    <p>🌧 ${precip.toFixed(1)} мм</p>
                `;
                hourlyContainer.appendChild(hourElem);
            });
        })
        .catch((error) => {
            errorMsg.textContent = "Місто не знайдено. Спробуйте інше.";
            errorMsg.style.display = "block";
            document.getElementById("city").textContent = "Невідоме місто";
            document.querySelector(".current-weather").style.display = "none";
            document.querySelector(".details").style.display = "none";
            document.querySelector(".forecast").innerHTML = '';
            document.getElementById("local-time").textContent = "--:--";
            hourlyContainer.innerHTML = '';
        });
}

getWeather();
