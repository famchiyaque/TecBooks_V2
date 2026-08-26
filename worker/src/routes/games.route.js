import { Hono } from "hono";
import { loggerMiddleware } from "../middleware/logger.middleware.js";
import { createGameController } from "../controllers/games.controller.js";

export const gamesRoute = new Hono();

gamesRoute.use("*", loggerMiddleware);
gamesRoute.post("/", createGameController);