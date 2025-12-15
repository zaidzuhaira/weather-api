import axios from "axios";
import { WeatherData } from "../types/weather";
import { fahrenheitToCelsius } from "../utils/temperature";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org";

interface DailyForecast {
  dt: number;
  temp: { day: number };
  humidity: number;
  wind_speed: number;
  weather: Array<{ description: string }>;
}

interface Alert {
  event: string;
}

interface OneCallResponse {
  lat: number;
  lon: number;
  daily: DailyForecast[];
  alerts?: Alert[];
}

interface GeoResponse {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export async function getThreeDayForecast(
  city: string,
  state: string
): Promise<WeatherData[]> {
  // Get coordinates from city/state
  const geoRes = await axios.get<GeoResponse[]>(`${BASE_URL}/geo/1.0/direct`, {
    params: { q: `${city},${state},US`, limit: 1, appid: API_KEY },
  });

  if (!geoRes.data.length) {
    throw new Error(`Location not found: ${city}, ${state}`);
  }

  const { lat, lon, name, state: stateName } = geoRes.data[0];

  // Get forecast with One Call API 3.0 (includes alerts)
  const { data } = await axios.get<OneCallResponse>(
    `${BASE_URL}/data/3.0/onecall`,
    {
      params: {
        lat,
        lon,
        exclude: "current,minutely,hourly",
        units: "imperial",
        appid: API_KEY,
      },
    }
  );

  const alertText = data.alerts?.map((a) => a.event).join("; ");

  // Return next 3 days
  return data.daily.slice(1, 4).map((day) => ({
    lat,
    long: lon,
    date: (day.dt * 1000).toString(),
    location: [name, stateName || state] as [string, string],
    tempFarenheit: Math.round(day.temp.day),
    tempCelsius: fahrenheitToCelsius(day.temp.day),
    humidity: day.humidity,
    windSpeed: Math.round(day.wind_speed),
    dailySummary: day.weather[0]?.description || "No description",
    alerts: alertText,
  }));
}
