import { Hono } from 'hono';
import { loggerMiddleware } from '../middleware/logger.middleware.js';

export const websocketRoute = new Hono();

websocketRoute.use('*', loggerMiddleware);

// Same layering applies here: this handler is the "controller" for the
// websocket path — swap the echo logic for a usecase/service call as needed.
websocketRoute.get('/', (c) => {
  if (c.req.header('Upgrade') !== 'websocket') {
    return c.text('Expected websocket upgrade', 426);
  }

  const pair = new WebSocketPair();
  const [client, server] = Object.values(pair);

  server.accept();
  server.addEventListener('message', (event) => {
    server.send(`echo: ${event.data}`);
  });

  return new Response(null, { status: 101, webSocket: client });
});
