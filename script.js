// http://api.weatherapi.com/v1/current.json?key=e8b227f41dfb47fb9bf133323253105&q=London&aqi=no

fetch("http://api.weatherapi.com/v1/current.json?key=e8b227f41dfb47fb9bf133323253105&q=London&aqi=no").then(res=>res.json()).then(console.log)  // отримуємо погоду
fetch("http://api.weatherapi.com/v1/forecast.json?key=e8b227f41dfb47fb9bf133323253105&q=London&days=14&aqi=no&alerts=no").then(res=>res.json()).then(console.log) // кільк погоди за 14 днів

// Получаем и выводим текущую погоду в консоль
fetch("http://api.weatherapi.com/v1/current.json?key=e8b227f41dfb47fb9bf133323253105&q=London&aqi=no")
    .then(res => res.json())
    .then(data => {
        console.log("Текущая погода:", data);
        const temp = data.current.temp_c;
        const desc = data.current.condition.text;
        const wind = data.current.wind_kph;
        const humidity = data.current.humidity;
        console.log(`Температура: ${temp}°C`);
        console.log(`Описание: ${desc}`);
        console.log(`Ветер: ${wind} км/ч`);
        console.log(`Влажность: ${humidity}%`);
    });

// Получаем и выводим прогноз на 3 дня в консоль и на страницу
fetch("http://api.weatherapi.com/v1/forecast.json?key=e8b227f41dfb47fb9bf133323253105&q=London&days=3&aqi=no&alerts=no")
    .then(res => res.json())
    .then(data => {
        console.log("Прогноз на 3 дня:", data.forecast.forecastday);

        // Находим секцию прогноза на странице
        const forecastSection = document.querySelector('.forecast');
        forecastSection.innerHTML = ''; // Очищаем старый прогноз

        data.forecast.forecastday.forEach(day => {
            // Создаем элементы для прогноза
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';

            // День недели
            const date = new Date(day.date);
            const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
            const dayName = days[date.getDay()];

            const p = document.createElement('p');
            p.textContent = dayName;

            // Иконка погоды
            const icon = document.createElement('img');
            icon.src = "https:" + day.day.condition.icon;
            icon.alt = day.day.condition.text;
            icon.style.width = "32px";
            icon.style.height = "32px";

            // Температура
            const span = document.createElement('span');
            span.textContent = `+${Math.round(day.day.avgtemp_c)}°C`;

            // Добавляем элементы в день
            dayDiv.appendChild(p);
            dayDiv.appendChild(icon);
            dayDiv.appendChild(span);

            // Добавляем день в секцию прогноза
            forecastSection.appendChild(dayDiv);

            // Также выводим в консоль
            console.log(
                `${day.date}: ${day.day.avgtemp_c}°C, ${day.day.condition.text}`
            );
        });

        // Выводим текущую погоду на страницу
        let currentSection = document.querySelector('.current-weather');
        if (currentSection && data.location && data.current) {
            currentSection.innerHTML = `
            <h2>Погода в ${data.location.name}, ${data.location.country}</h2>
            <p>Температура: ${data.current.temp_c}°C</p>
            <p>Описание: ${data.current.condition.text}</p>
            <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}" width="48" height="48">
            <p>Ветер: ${data.current.wind_kph} км/ч</p>
            <p>Влажность: ${data.current.humidity}%</p>
            `;
        }
    });
