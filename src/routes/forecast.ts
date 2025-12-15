import { Router } from "express";
import { getForecast, saveForecasts } from "../controllers/forecastController";

const router = Router();

router.get("/", getForecast);
router.post("/", saveForecasts);

export default router;
