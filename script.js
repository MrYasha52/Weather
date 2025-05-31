// http://api.weatherapi.com/v1/current.json?key=e8b227f41dfb47fb9bf133323253105&q=London&aqi=no

fetch("http://api.weatherapi.com/v1/current.json?key=e8b227f41dfb47fb9bf133323253105&q=London&aqi=no").then(res=>res.json()).then(console.log)  // отримуємо погоду
fetch("http://api.weatherapi.com/v1/forecast.json?key=e8b227f41dfb47fb9bf133323253105&q=London&days=14&aqi=no&alerts=no").then(res=>res.json()).then(console.log) // кільк погоди за 14 днів

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudSun, MapPin } from 'lucide-react';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const mockWeather = {
    city: 'Москва',
    temperature: '18°C',
    condition: 'Облачно',
    forecast: [
      { day: 'Пн', temp: '17°C', icon: '🌧️' },
      { day: 'Вт', temp: '19°C', icon: '🌤️' },
      { day: 'Ср', temp: '21°C', icon: '☀️' },
      { day: 'Чт', temp: '20°C', icon: '⛅' },
      { day: 'Пт', temp: '16°C', icon: '🌧️' },
    ],
  };

  const handleSearch = () => {
    // Здесь будет реальный API-запрос
    setWeather(mockWeather);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🌦️ Прогноз погоды</h1>
      <div className="flex gap-2">
        <Input
          placeholder="Введите город..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button onClick={handleSearch}>Найти</Button>
      </div>

      {weather && (
        <Card className="mt-4">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <MapPin size={20} />
              {weather.city}
            </div>
            <div className="flex items-center gap-4 text-3xl font-bold">
              <CloudSun size={40} />
              {weather.temperature} — {weather.condition}
            </div>
            <div className="grid grid-cols-5 gap-4 mt-4">
              {weather.forecast.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-semibold">{day.day}</div>
                  <div className="text-2xl">{day.icon}</div>
                  <div>{day.temp}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherApp;
