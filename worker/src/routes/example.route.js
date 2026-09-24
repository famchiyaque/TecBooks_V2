import { Hono } from 'hono';
import { loggerMiddleware } from '../middleware/logger.middleware.js';
import { getExampleController, listExamplesController, createExampleController } from '../controllers/example.controller.js';

export const exampleRoute = new Hono();

exampleRoute.use('*', loggerMiddleware);
exampleRoute.get('/', listExamplesController);
exampleRoute.get('/:id', getExampleController);
exampleRoute.post('/', createExampleController);
