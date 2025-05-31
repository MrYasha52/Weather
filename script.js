// http://api.weatherapi.com/v1/current.json?key=e8b227f41dfb47fb9bf133323253105&q=London&aqi=no

fetch("http://api.weatherapi.com/v1/current.json?key=e8b227f41dfb47fb9bf133323253105&q=London&aqi=no").then(res=>res.json()).then(console.log)  // отримуємо погоду
fetch("http://api.weatherapi.com/v1/forecast.json?key=e8b227f41dfb47fb9bf133323253105&q=London&days=14&aqi=no&alerts=no").then(res=>res.json()).then(console.log) // кільк погоди за 14 днів

