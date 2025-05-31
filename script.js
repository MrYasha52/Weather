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

  const handleSearch = async () => {
    if (!city) return;

    try {
      const apiKey = 'e8b227f41dfb47fb9bf133323253105';
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`
      );
      const data = await response.json();

      if (data.error) {
        alert(`Ошибка: ${data.error.message}`);
        return;
      }

      setWeather({
        city: data.location.name,
        temperature: `${data.current.temp_c}°C`,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        forecast: [], // Можно добавить прогноз позже
      });
    } catch (error) {
      console.error(error);
      alert('Не удалось загрузить данные о погоде.');
    }
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
              <img src={weather.icon} alt={weather.condition} className="w-12 h-12" />
              {weather.temperature} — {weather.condition}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherApp;
