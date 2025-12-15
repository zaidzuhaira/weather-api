import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { logger } from "./middleware/logger";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import indexRouter from "./routes/index";
import forecastRouter from "./routes/forecast";

const app = express();

// Middleware
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", indexRouter);
app.use("/forecast", forecastRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
