import { Hono } from 'hono';
import { loggerMiddleware } from '../middleware/logger.middleware.js';
import { loginController, registerController, logoutController } from '../controllers/auth.controller.js';

export const authRoute = new Hono();

authRoute.use('*', loggerMiddleware);
authRoute.post('/login', loginController);
authRoute.post('/register', registerController);
authRoute.post('/logout', logoutController);
