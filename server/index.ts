import dotenv from 'dotenv'
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { vValidator } from '@hono/valibot-validator';
import { createBunWebSocket } from 'hono/bun';
import type { ServerWebSocket } from 'bun';

import { type Message, type DataToSend, MessageFormSchema } from './shared/types';
import { publishActions } from './shared/constants';

dotenv.config({ path: '../.env' })

const config = {
  FRONTEND_URL: process.env.FRONTEND_URL!,
  BACKEND_URL: process.env.BACKEND_URL!,
  BACKEND_WS_URL: process.env.BACKEND_WS_URL!,
  BACKEND_PORT: process.env.BACKEND_URL!.split(':')[2],
}

console.log({ config })

const app = new Hono();
app.use('*', cors({ origin: config.FRONTEND_URL }));

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

const server = Bun.serve({
  fetch: app.fetch,
  port: config.BACKEND_PORT,
  websocket
});

const topic = 'anonymous-chat-room';
const messages: Message[] = [{
  id: 1,
  date: new Date().toISOString(),
  userId: 'yyy',
  text: 'zzz'
}];

const messagesRoute = app
  .get('/', (c) => c.text('Hono!'))
  .get('/messages', (c) => {
    return c.json(messages);
  })
  .post(
    '/messages',
    vValidator('form', MessageFormSchema, (result, c) => {
      if (!result.success) {
        return c.json({ ok: false }, 400);
      }
    }),
    async (c) => {
      const param = c.req.valid('form');
      const currentDateTime = new Date();
      const message: Message = {
        id: Number(currentDateTime),
        date: currentDateTime.toLocaleString(),
        ...param,
      };
      const data: DataToSend = {
        action: publishActions.UPDATE_CHAT,
        message: message,
      };

      messages.push(message);
      server.publish(topic, JSON.stringify(data));

      return c.json({ ok: true });
    }
  )

  app.get(
    '/ws',
    upgradeWebSocket((_) => ({
      onOpen(_, ws) {
        const rawWs = ws.raw as ServerWebSocket;
        rawWs.subscribe(topic);
        console.log(`WebSocket server opened and subscribed to topic '${topic}'`);
      },
      onClose(_, ws) {
        const rawWs = ws.raw as ServerWebSocket;
        rawWs.unsubscribe(topic);
        console.log(
          `WebSocket server closed and unsubscribed from topic '${topic}'`
        );
      },
    }))
  );

export default app;
export type AppType = typeof messagesRoute;