import { Router } from "express";
import { getNextThreeDaysForecast } from "../controllers/forecastController";

const router = Router();

router.get("/", getNextThreeDaysForecast);

export default router;
