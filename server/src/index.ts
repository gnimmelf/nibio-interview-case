import dotenv from 'dotenv'
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { setRoutes, websocket } from './routes'

dotenv.config({ path: '../.env' })

const config = {
  FRONTEND_URL: process.env.FRONTEND_URL!,
  BACKEND_URL: process.env.BACKEND_URL!,
  BACKEND_WS_URL: process.env.BACKEND_WS_URL!,
  BACKEND_PORT: process.env.BACKEND_URL!.split(':')[2],
}

/**
 * Instantiate app, start server
 */
const app = new Hono();

app.use('*', cors({ origin: config.FRONTEND_URL }));
app.get('/', (c) => c.text('Hono!'))

const server = Bun.serve({
  fetch: app.fetch,
  port: parseInt(config.BACKEND_PORT!),
  websocket
});

setRoutes(server, app, config)