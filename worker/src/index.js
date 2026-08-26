import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { errorHandler } from './middleware/error-handler.middleware.js';
import { healthRoute } from './routes/health.route.js';
import { exampleRoute } from './routes/example.route.js';
import { authRoute } from './routes/auth.route.js';
import { websocketRoute } from './routes/websocket.route.js';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: (origin) => origin,
    credentials: true,
  })
);
app.onError(errorHandler);

app.route('/health', healthRoute);
app.route('/api/examples', exampleRoute);
app.route('/api/auth', authRoute);
app.route('/ws', websocketRoute);

export default app;
