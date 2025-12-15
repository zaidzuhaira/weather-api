export interface WeatherData {
  lat: number;
  long: number;
  date: string;
  location: [string, string];
  tempFarenheit: number;
  tempCelsius: number;
  humidity: number;
  windSpeed: number;
  dailySummary: string;
  alerts?: string;
}

export interface ForecastResponse {
  forecast: WeatherData[];
}
