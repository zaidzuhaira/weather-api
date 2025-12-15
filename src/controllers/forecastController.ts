import { Request, Response, NextFunction } from "express";
import { getThreeDayForecast } from "../services/weatherService";
import { findForecast, saveForecast } from "../repositories/forecastRepository";
import { weatherDataSchema } from "../validators/forecastValidator";
import createError from "http-errors";

export const getForecast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { city, state, date } = req.query;

    if (!city || !state) {
      throw createError(400, "Provide city & state query parameters");
    }

    const cityStr = String(city);
    const stateStr = String(state);

    // If date is provided, look up specific saved forecast
    if (date) {
      const saved = await findForecast(cityStr, stateStr, String(date));
      if (saved) {
        res.json({ forecast: [saved] });
        return;
      }
    }

    // Fetch from API
    const forecast = await getThreeDayForecast(cityStr, stateStr);

    // If date was requested, filter to that specific date
    if (date) {
      const match = forecast.find((f) => f.date === String(date));
      if (match) {
        res.json({ forecast: [match] });
        return;
      }
      throw createError(404, "Forecast not found for the specified date");
    }

    res.json({ forecast });
  } catch (error) {
    next(error);
  }
};

// POST /forecast
export const saveForecasts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const result = weatherDataSchema.safeParse(req.body);
    if (!result.success) {
      throw createError(400, result.error.errors[0].message);
    }

    const forecast = result.data;
    const [city, state] = forecast.location;

    await saveForecast(city, state, forecast);

    res.status(201).json({
      message: "Forecast saved successfully",
      forecast,
    });
  } catch (error) {
    next(error);
  }
};
