import { Hono } from 'hono';
import { loggerMiddleware } from '../middleware/logger.middleware.js';
import { sessionMiddleware } from '../middleware/session.middleware.js';
import {
  getTableRowValuesController,
  replaceTableRowValuesController,
} from '../controllers/table-row-values.controller.js';

export const tableRowValuesRoute = new Hono();

tableRowValuesRoute.use('*', loggerMiddleware);
tableRowValuesRoute.use('*', sessionMiddleware);
tableRowValuesRoute.get('/:gameId/:type', getTableRowValuesController);
tableRowValuesRoute.put('/:gameId/:type', replaceTableRowValuesController);
