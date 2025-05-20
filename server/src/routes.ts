import { randomUUID } from 'crypto'
import { Hono } from 'hono';
import { vValidator } from '@hono/valibot-validator';
import { createBunWebSocket } from 'hono/bun';
import type { ServerWebSocket } from 'bun';

import {
  type ChatMessageType,
  type ChatMessage,
  type ConnectedMessageType,
  ChatMessageSchema
} from '../shared/types';
import { messageTypes } from '../shared/constants';

const topics = {
  chatRoom: 'chat-room',
  playerMove: 'player-move'
};

/**
 * Registries
 */
let chatHistory: ChatMessage[] = [];
let connectionIds: string[] = []

interface WsData {
  wsId: string;
  userId: string
}

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket<WsData>>();

export { websocket };

export const setRoutes = (server: Bun.Server, app: Hono) => {

  app.get(
    '/chat',
    (c) => {
      return c.json(chatHistory);
    })
    .post(
      '/chat',
      vValidator('json', ChatMessageSchema, (result, c) => {
        if (!result.success) {
          return c.json({ ok: false }, 400);
        }
      }),
      async (c) => {
        const param = c.req.valid('json');

        const message: ChatMessageType = {
          type: messageTypes.UPDATE_CHAT,
          content: {
            ...param,
          },
        };

        chatHistory.push(message.content);
        server.publish(topics.chatRoom, JSON.stringify(message));

        return c.json({ ok: true });
      }
    )

  app.get(
    '/ws',
    upgradeWebSocket((_) => {
      return {
        onOpen(_, ws) {
          const rawWs = ws.raw!;
          // Assign unique ID to this connection
          const wsId = randomUUID();
          rawWs.data.wsId = wsId;

          rawWs.subscribe(topics.chatRoom);
          rawWs.subscribe(topics.playerMove);

          const message: ConnectedMessageType = {
            type: messageTypes.CONNECTED,
            content: { userId: wsId },
          };
          ws.send(JSON.stringify(message));

          console.log(`WebSocket ${rawWs.data.wsId} opened and subscribed to topics`);
        },
        onClose(_, ws) {
          const rawWs = ws.raw!;
          const wsId = rawWs.data.wsId;
          rawWs.unsubscribe(topics.chatRoom);
          rawWs.subscribe(topics.playerMove);

          // TODO! Make a better solution for the registries
          chatHistory = chatHistory.filter(({ userId }) => userId != wsId);

          console.log(
            `WebSocket ${rawWs.data?.wsId} closed and unsubscribed from topics`
          );
        },
      }
    })
  );

}