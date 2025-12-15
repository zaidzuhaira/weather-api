import { Request, Response, NextFunction } from "express";
import { getThreeDayForecast } from "../services/weatherService";
import createError from "http-errors";

export const getNextThreeDaysForecast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { city, state } = req.query;

    if (!city || !state) {
      throw createError(400, "Provide city & state query parameters");
    }

    const forecast = await getThreeDayForecast(String(city), String(state));
    res.json({ forecast });
  } catch (error) {
    next(error);
  }
};
