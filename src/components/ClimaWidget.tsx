import React, { useState, useEffect } from "react";

interface ClimaData {
  temperature: number;
  description: string;
  city: string;
  icon: string;
}

interface ClimaWidgetProps {
  city?: string;
}

export default function ClimaWidget({ city = "Manta" }: ClimaWidgetProps) {
  const [clima, setClima] = useState<ClimaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API key de OpenWeatherMap
  const API_KEY = "3ccdb9f698c0dc253a65b99a1a3326e9";
  
  useEffect(() => {
    async function fetchClima() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},EC&appid=${API_KEY}&units=metric&lang=es`
        );
        
        if (!response.ok) {
          throw new Error("Error al obtener datos del clima");
        }
        
        const data = await response.json();
        
        setClima({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          city: data.name,
          icon: data.weather[0].icon
        });
        
      } catch (err) {
        setError("Error al cargar clima");
        console.error("Error del clima:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClima();
  }, [city, API_KEY]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-300">
        <div className="animate-pulse">
          <div className="text-center mb-4">
            <div className="h-4 bg-slate-200 rounded w-24 mx-auto mb-2"></div>
            <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-16 mx-auto mb-1"></div>
            <div className="h-4 bg-slate-200 rounded w-20 mx-auto"></div>
          </div>
          <div className="pt-3 border-t border-slate-200">
            <div className="h-3 bg-slate-200 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-300">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Clima</h3>
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
          </div>
          <div className="text-sm text-red-700 font-medium">No disponible</div>
          <div className="text-xs text-red-500">Intenta más tarde</div>
        </div>
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Error de conexión</span>
          </div>
        </div>
      </div>
    );
  }

  if (!clima) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-300">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Clima en {clima.city}</h3>
        <div className="flex items-center justify-center mb-2">
          <img 
            src={`https://openweathermap.org/img/wn/${clima.icon}.png`}
            alt={clima.description}
            className="w-16 h-16"
          />
        </div>
        <div className="text-3xl font-bold text-slate-800 mb-1">{clima.temperature}°C</div>
        <div className="text-sm text-slate-600 capitalize">{clima.description}</div>
      </div>
      
      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Actualizado ahora</span>
        </div>
      </div>
    </div>
  );
}