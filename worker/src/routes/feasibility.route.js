import { Hono } from 'hono';
import { loggerMiddleware } from '../middleware/logger.middleware.js';
import { sessionMiddleware } from '../middleware/session.middleware.js';
import { getFeasibilityModelController } from '../controllers/feasibility-model.controller.js';
import {
  listTableRowsController,
  replaceTableRowsController,
  deleteTableRowController,
} from '../controllers/row-table.controller.js';

export const feasibilityRoute = new Hono();

feasibilityRoute.use('*', loggerMiddleware);
feasibilityRoute.use('*', sessionMiddleware);
// Registered before the bare '/:gameId' so a longer path (/:gameId/rows...)
// isn't swallowed by it - Hono matches by segment count so this wouldn't
// actually collide either way, but keeping the more specific routes first
// reads correctly regardless.
feasibilityRoute.get('/:gameId/rows', listTableRowsController);
feasibilityRoute.put('/:gameId/rows/:tableKey', replaceTableRowsController);
feasibilityRoute.delete('/:gameId/rows/:tableKey/:rowId', deleteTableRowController);
feasibilityRoute.get('/:gameId', getFeasibilityModelController);
