import { WeatherData } from "../types/weather";
import { fahrenheitToCelsius } from "../utils/temperature";
import { getCoordinates, getForecastByCoords } from "./openWeatherService";

export async function getThreeDayForecast(
  city: string,
  state: string
): Promise<WeatherData[]> {
  // Get coordinates from city/state
  const location = await getCoordinates(city, state);

  // Get forecast data
  const forecast = await getForecastByCoords(location.lat, location.lon);

  const alertText = forecast.alerts?.map((a) => a.event).join("; ");

  // Transform and return next 3 days
  return forecast.daily.slice(1, 4).map((day) => ({
    lat: location.lat,
    long: location.lon,
    date: (day.dt * 1000).toString(),
    location: [location.name, location.state || state] as [string, string],
    tempFarenheit: Math.round(day.temp.day),
    tempCelsius: fahrenheitToCelsius(day.temp.day),
    humidity: day.humidity,
    windSpeed: Math.round(day.wind_speed),
    dailySummary: day.weather[0]?.description || "No description",
    alerts: alertText,
  }));
}
