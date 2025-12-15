import axios, { AxiosError } from "axios";
import createError from "http-errors";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org";

interface GeoLocation {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

interface DailyForecast {
  dt: number;
  temp: { day: number };
  humidity: number;
  wind_speed: number;
  weather: Array<{ description: string }>;
}

interface OneCallResponse {
  lat: number;
  lon: number;
  daily: DailyForecast[];
  alerts?: Array<{ event: string }>;
}

function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;

    console.error("OpenWeather API Error:", {
      status,
      message,
      url: error.config?.url,
    });

    if (status === 401) {
      throw createError(401, "Invalid API key or subscription required");
    }
    if (status === 404) {
      throw createError(404, "Location not found");
    }
    if (status === 429) {
      throw createError(429, "API rate limit exceeded");
    }

    throw createError(status, `Weather API error: ${message}`);
  }

  throw error;
}

export async function getCoordinates(
  city: string,
  state: string
): Promise<GeoLocation> {
  try {
    const response = await axios.get<GeoLocation[]>(
      `${BASE_URL}/geo/1.0/direct`,
      {
        params: { q: `${city},${state},US`, limit: 1, appid: API_KEY },
      }
    );

    if (!response.data.length) {
      throw createError(404, `Location not found: ${city}, ${state}`);
    }

    return response.data[0];
  } catch (error) {
    handleApiError(error);
  }
}

export async function getForecastByCoords(
  lat: number,
  lon: number
): Promise<OneCallResponse> {
  try {
    const response = await axios.get<OneCallResponse>(
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

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

