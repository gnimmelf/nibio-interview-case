import dotenv from 'dotenv'
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { setupAppRoutes, websocket } from './routes'
import { getValidUrl } from '../shared/utils';

dotenv.config({ path: '../.env' })

const envVars = {
  FRONTEND_HOST: process.env.FRONTEND_HOST!,
  BACKEND_HOST: process.env.BACKEND_HOST!,
  FRONTEND_PORT: process.env.FRONTEND_PORT!,
  BACKEND_PORT: process.env.BACKEND_PORT!,
  SECRET_KEY: process.env.SECRET_KEY!,
}
export type EnvVars = typeof envVars


/**
 * Instantiate app, start server
 */
const app = new Hono();

app.use('*', cors({ origin: getValidUrl(envVars.FRONTEND_HOST, envVars.FRONTEND_PORT) }));
app.get('/', (c) => c.text('Hono!'))

const server = Bun.serve({
  fetch: app.fetch,
  port: envVars.BACKEND_PORT,
  websocket
});

setupAppRoutes(server, app, envVars)