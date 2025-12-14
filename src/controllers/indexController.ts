import { Request, Response } from "express";

export const getIndex = (_req: Request, res: Response): void => {
  res.json({
    message: "Welcome to Weather API",
    version: "1.0.0",
  });
};
