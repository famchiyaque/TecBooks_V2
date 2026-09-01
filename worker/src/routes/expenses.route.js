import { Hono } from "hono";
import { loggerMiddleware } from "../middleware/logger.middleware.js";
import {getExpensesController} from "../controllers/expenses.controller.js";

export const expensesRoute = new Hono();

expensesRoute.use("#", loggerMiddleware);
expensesRoute.get("/", getExpensesController)
