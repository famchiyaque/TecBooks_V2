import { Hono } from "hono";
import { loggerMiddleware } from "../middleware/logger.middleware";
import { sessionMiddleware } from "../middleware/session.middleware";
import { createGame, joinRoom } from "../controllers/games.controller";
import { requireTeacher } from "../middleware/require-teacher.middleware";
import { getProjects } from "../controllers/project.controller";

export const gameRoute = new Hono();

gameRoute.use("*", loggerMiddleware);
gameRoute.use("*", sessionMiddleware);

gameRoute.get("/projects", getProjects);
gameRoute.post("/create", requireTeacher, createGame);
gameRoute.get("/:code/join", joinRoom);
