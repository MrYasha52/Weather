// http://api.weatherapi.com/v1/current.json?key=e8b227f41dfb47fb9bf133323253105&q=London&aqi=no

// ТОЛЬКО КЛЮЧ!
const API_KEY = "e8b227f41dfb47fb9bf133323253105";
const CITY = "Kyiv";

// Сформировать URL
const URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&days=10&aqi=no&alerts=no`;

// Получение и отображение погоды
fetch(URL)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    document.getElementById("city").textContent = `${data.location.name}, ${data.location.country}`;

    const now = new Date();
    document.getElementById("date").textContent = now.toLocaleDateString("ru-RU", {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    document.getElementById("icon").src = `https:${data.current.condition.icon}`;
    document.getElementById("desc").textContent = data.current.condition.text;
    document.getElementById("temp").textContent = `${data.current.temp_c} °C`;
    document.getElementById("wind").textContent = (data.current.wind_kph / 3.6).toFixed(1);
    document.getElementById("humidity").textContent = data.current.humidity;
let forecast = document.querySelector('.forecast');
forecast.innerHTML = '';
    data.forecast.forecastday.forEach((day, index) => {
        console.log(day);
        forecast.innerHTML += `
            <div class="day">
                <p>${day.date}</p>
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                <span>${day.day.avgtemp_c} °C</span>
            </div>
        `
    })
  })
//   .catch((error) => {
//     console.error("Ошибка при загрузке данных погоды:", error);
//     document.getElementById("city").textContent = "Ошибка загрузки данных";
//   });
