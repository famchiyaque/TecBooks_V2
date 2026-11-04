import { Hono } from "hono";
import { loggerMiddleware } from "../middleware/logger.middleware";
import { sessionMiddleware } from "../middleware/session.middleware";
import { createGame } from "../controllers/games.controller";
import { requireTeacher } from "../middleware/require-teacher.middleware";

export const gameRoute = new Hono();

gameRoute.use("*", loggerMiddleware);
gameRoute.use("*", sessionMiddleware);

gameRoute.post("/:gameId/room", requireTeacher, createGame);
gameRoute.get("/:code/join", joinRoom);
