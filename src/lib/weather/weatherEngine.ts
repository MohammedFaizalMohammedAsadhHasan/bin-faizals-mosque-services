'use client';

export interface WeatherData {
  tempC: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeedKmH: number;
  sunrise: string;
  sunset: string;
  city: string;
}

const WEATHER_CODE_MAP: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear Sky', icon: '☀️' },
  1: { condition: 'Mainly Clear', icon: '🌤️' },
  2: { condition: 'Partly Cloudy', icon: '⛅' },
  3: { condition: 'Overcast', icon: '☁️' },
  45: { condition: 'Foggy', icon: '🌫️' },
  48: { condition: 'Depositing Rime Fog', icon: '🌫️' },
  51: { condition: 'Light Drizzle', icon: '🌦️' },
  53: { condition: 'Moderate Drizzle', icon: '🌧️' },
  55: { condition: 'Dense Drizzle', icon: '🌧️' },
  61: { condition: 'Slight Rain', icon: '🌧️' },
  63: { condition: 'Moderate Rain', icon: '🌧️' },
  65: { condition: 'Heavy Rain', icon: '🌧️' },
  80: { condition: 'Rain Showers', icon: '🌦️' },
  81: { condition: 'Moderate Showers', icon: '🌧️' },
  82: { condition: 'Violent Showers', icon: '⛈️' },
  95: { condition: 'Thunderstorm', icon: '⛈️' },
};

export async function fetchLiveWeather(
  latitude: number = 6.9271,
  longitude: number = 79.8612,
  city: string = "Colombo"
): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=auto`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Weather API error');

    const data = await res.json();
    const current = data.current || {};
    const daily = data.daily || {};
    const code = current.weather_code ?? 0;
    const mapped = WEATHER_CODE_MAP[code] || { condition: 'Clear', icon: '🌤️' };

    const formatTimeOnly = (isoStr?: string) => {
      if (!isoStr) return '--:--';
      const d = new Date(isoStr);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return {
      tempC: Math.round(current.temperature_2m ?? 29),
      condition: mapped.condition,
      icon: mapped.icon,
      humidity: Math.round(current.relative_humidity_2m ?? 75),
      windSpeedKmH: Math.round(current.wind_speed_10m ?? 12),
      sunrise: formatTimeOnly(daily.sunrise?.[0]),
      sunset: formatTimeOnly(daily.sunset?.[0]),
      city,
    };
  } catch {
    // Fallback static weather for resilience/offline
    return {
      tempC: 29,
      condition: 'Partly Cloudy',
      icon: '⛅',
      humidity: 78,
      windSpeedKmH: 14,
      sunrise: '06:05 AM',
      sunset: '06:24 PM',
      city,
    };
  }
}
