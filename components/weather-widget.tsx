"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Wind } from "lucide-react"

interface WeatherWidgetProps {
  city: string
}

export function WeatherWidget({ city }: WeatherWidgetProps) {
  const [weather, setWeather] = useState({
    temperature: 28,
    condition: "Soleado",
    humidity: 65,
    windSpeed: 12,
  })

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "soleado":
        return <Sun className="w-8 h-8 text-yellow-500" />
      case "nublado":
        return <Cloud className="w-8 h-8 text-gray-500" />
      case "lluvioso":
        return <CloudRain className="w-8 h-8 text-blue-500" />
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          {getWeatherIcon(weather.condition)}
          <span>Clima en {city}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-900">{weather.temperature}°C</div>
          <div className="text-blue-700">{weather.condition}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-700">Humedad: {weather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-3 h-3 text-blue-500" />
            <span className="text-blue-700">Viento: {weather.windSpeed} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
