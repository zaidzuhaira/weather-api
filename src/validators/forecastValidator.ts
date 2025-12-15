import { z } from "zod";

export const weatherDataSchema = z.object({
  lat: z.number(),
  long: z.number(),
  date: z.string(),
  location: z.tuple([z.string(), z.string()]),
  tempFarenheit: z.number(),
  tempCelsius: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  dailySummary: z.string(),
  alerts: z.string().optional(),
});

export type ValidatedWeatherData = z.infer<typeof weatherDataSchema>;
