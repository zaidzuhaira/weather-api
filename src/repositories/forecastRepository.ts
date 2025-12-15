import db from "../db/knex";
import { WeatherData } from "../types/weather";

interface ForecastRow {
  id: number;
  city: string;
  state: string;
  date: string;
  lat: string;
  long: string;
  temp_fahrenheit: number;
  temp_celsius: number;
  humidity: number;
  wind_speed: number;
  daily_summary: string;
  alerts: string | null;
}

function rowToWeatherData(row: ForecastRow): WeatherData {
  return {
    lat: parseFloat(row.lat),
    long: parseFloat(row.long),
    date: row.date,
    location: [row.city, row.state],
    tempFarenheit: row.temp_fahrenheit,
    tempCelsius: row.temp_celsius,
    humidity: row.humidity,
    windSpeed: row.wind_speed,
    dailySummary: row.daily_summary,
    alerts: row.alerts || undefined,
  };
}

export async function findForecast(
  city: string,
  state: string,
  date: string
): Promise<WeatherData | null> {
  const row = await db<ForecastRow>("forecasts")
    .where({ city: city.toLowerCase(), state: state.toLowerCase(), date })
    .first();

  return row ? rowToWeatherData(row) : null;
}

export async function saveForecast(
  city: string,
  state: string,
  forecast: WeatherData
): Promise<void> {
  await db("forecasts")
    .insert({
      city: city.toLowerCase(),
      state: state.toLowerCase(),
      date: forecast.date,
      lat: forecast.lat,
      long: forecast.long,
      temp_fahrenheit: forecast.tempFarenheit,
      temp_celsius: forecast.tempCelsius,
      humidity: forecast.humidity,
      wind_speed: forecast.windSpeed,
      daily_summary: forecast.dailySummary,
      alerts: forecast.alerts || null,
    })
    .onConflict(["city", "state", "date"])
    .merge();
}
