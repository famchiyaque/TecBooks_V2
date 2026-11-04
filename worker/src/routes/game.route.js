import { Hono } from "hono";
import { loggerMiddleware } from "../middleware/logger.middleware";
import { sessionMiddleware } from "../middleware/session.middleware";
import { createGame } from "../controllers/games.controller";

export const gameRoute = new Hono();

gameRoute.use("*", loggerMiddleware);
gameRoute.use("*", sessionMiddleware);

gameRoute.post("/create", createGame);
gameRoute.get("/:roomId", joinRoom);
