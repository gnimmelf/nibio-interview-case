import { randomUUID } from 'crypto'
import { Hono } from 'hono';
import { vValidator } from '@hono/valibot-validator';
import { createBunWebSocket } from 'hono/bun';
import type { ServerWebSocket } from 'bun';

import {
  type ChatMessageType,
  type ChatMessage,
  type ConnectedMessageType,
  ChatMessageSchema,
  type ConnectionsMessageType
} from '../shared/types';
import { messageTypes } from '../shared/constants';

const topics = {
  gameRoom: 'game-room',
};

type WsId = string;
interface WsData {
  wsId: WsId
  userId: string
}

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket<WsData>>();

export { websocket };

/**
 * Registries
 */
let chatHistory: ChatMessage[] = [];
let connectionIds: string[] = []

/**
 * Update connections pool
 * @param ws Hono WebSocket Context
 * @param options.add ConnectionId to add - optional
 * @param options.remove ConnectionId to remove - optional
 */
function updateConnectionPool(server: Bun.Server, options: {
  add?: WsId
  remove?: WsId
}) {
  console.assert(options?.add || options?.remove, 'updateConnectionPool missing options', options)
  if (options?.add) {
    connectionIds.push(options.add)
  }
  if (options?.remove) {
    connectionIds = connectionIds.filter((userId) => userId != options?.remove)
  }
  const message: ConnectionsMessageType = {
    type: messageTypes.CONNECTIONS_UPDATE,
    content: {
      connectionIds: connectionIds,
    },
  };
  server.publish(topics.gameRoom, JSON.stringify(message));

  console.log(`WebSocket connection pool ${options?.add ? 'add' : 'remove'} update sent`);
}

export const setRoutes = (server: Bun.Server, app: Hono, settings: Record<string, any>) => {
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
          type: messageTypes.CHAT_UPDATE,
          content: {
            ...param,
          },
        };

        chatHistory.push(message.content);
        server.publish(topics.gameRoom, JSON.stringify(message));

        return c.json({ ok: true });
      }
    )

  app.get(
    '/ws',
    upgradeWebSocket((_) => {
      return {
        onOpen(_, ws) {
          const rawWs = ws.raw!;
          // Assign a unique ID to this connection
          const wsId = randomUUID() as string;
          rawWs.data.wsId = wsId;

          // Update subscriptions
          rawWs.subscribe(topics.gameRoom);

          // Connect user
          const connectedMessage: ConnectedMessageType = {
            type: messageTypes.CONNECTED,
            content: {
              userId: wsId,
            },
          };
          ws.send(JSON.stringify(connectedMessage));
          console.log(`WebSocket ${rawWs.data.wsId} opened and subscribed to topics`);

          // Update connectionIds
          updateConnectionPool(server, { add: wsId })
        },
        onClose(_, ws) {
          const rawWs = ws.raw!;
          const wsId = rawWs.data.wsId;

          // Update subscriptions
          rawWs.unsubscribe(topics.gameRoom);

          console.log(
            `WebSocket ${rawWs.data?.wsId} closed and unsubscribed from topics`
          );

          // Update connectionIds
          updateConnectionPool(server, { remove: wsId })
        },
      }
    })
  );

}