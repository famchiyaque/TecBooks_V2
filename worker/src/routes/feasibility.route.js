import { Hono } from 'hono';
import { loggerMiddleware } from '../middleware/logger.middleware.js';
import { sessionMiddleware } from '../middleware/session.middleware.js';
import { getFeasibilityModelController } from '../controllers/feasibility-model.controller.js';

export const feasibilityRoute = new Hono();

feasibilityRoute.use('*', loggerMiddleware);
feasibilityRoute.use('*', sessionMiddleware);
feasibilityRoute.get('/:gameId', getFeasibilityModelController);
