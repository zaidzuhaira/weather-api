import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(createError(404));
};

export const errorHandler = (
  err: createError.HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};

  // Send error response
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};
