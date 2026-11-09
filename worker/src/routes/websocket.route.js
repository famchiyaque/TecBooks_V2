import { Hono } from "hono";
import { loggerMiddleware } from "../middleware/logger.middleware.js";
import { connectCode } from "../controllers/games.controller.js";

export const websocketRoute = new Hono();

websocketRoute.use("*", loggerMiddleware);

// Same layering applies here: this handler is the "controller" for the
// websocket path — swap the echo logic for a usecase/service call as needed.
websocketRoute.get("/rooms/:code", connectCode);
