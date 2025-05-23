import dotenv from 'dotenv'
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { setupAppRoutes, websocket } from './routes'

dotenv.config({ path: '../.env' })

const settings = {
  FRONTEND_URL: process.env.FRONTEND_URL!,
  BACKEND_URL: process.env.BACKEND_URL!,
  BACKEND_WS_URL: process.env.BACKEND_WS_URL!,
  BACKEND_PORT: process.env.BACKEND_URL!.split(':')[2],
  SECRET_KEY: 'super-secret-key'
}
export type ServerSettings = typeof settings

/**
 * Instantiate app, start server
 */
const app = new Hono();

app.use('*', cors({ origin: settings.FRONTEND_URL }));
app.get('/', (c) => c.text('Hono!'))

const server = Bun.serve({
  fetch: app.fetch,
  port: parseInt(settings.BACKEND_PORT!),
  websocket
});

setupAppRoutes(server, app, settings)