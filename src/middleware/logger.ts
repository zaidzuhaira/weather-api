import morgan from "morgan";

export const logger = morgan(
  process.env.NODE_ENV === "development" ? "dev" : "combined"
);
