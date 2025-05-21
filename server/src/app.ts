import { randomUUID } from 'crypto'
import { Hono, type Context } from 'hono';
import { vValidator } from '@hono/valibot-validator';
import { createBunWebSocket } from 'hono/bun';
import type { ServerWebSocket } from 'bun';

import { createWsIdToken, dir, validateAuthHeader, verifyWsIdToken } from './utils';
import {
  type ChatMessageType,
  type ChatFormValues,
  type ConnectedMessageType,
  ChatMessageSchema,
  type ConnectionsMessageType
} from '../shared/types';
import { messageTypes } from '../shared/constants';
import type { ServerSettings } from './main';

const topics = {
  gameRoom: 'game-room',
};

// Websocket type defs
type WsId = string;
interface WsData {
  wsId: WsId
  token: string
}
type WsInstance = ServerWebSocket<WsData>

// TODO! Hoist this and pass in dependency injection
const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket<WsData>>();

export { websocket };

/**
 * Registries
 */
let chatHistory: ChatFormValues[] = [];
let activeConnections: WsInstance[] = []

/**
 * Update active connections
 * @param ws Hono WebSocket
 * @param options.add Connection to add - optional
 * @param options.remove Connection to remove - optional
 */

function updateActiveConnections(server: Bun.Server, options: {
  add?: WsInstance
  remove?: WsInstance
}) {
  console.assert(options?.add || options?.remove, 'updateActiveConnections missing options', options)

  if (options?.add) {
    activeConnections.push(options.add)
  }

  if (options?.remove) {
    activeConnections = activeConnections.filter((ws) => {
      return ws.data.wsId !== options.remove!.data.wsId;
    });
  }

  const message: ConnectionsMessageType = {
    type: messageTypes.CONNECTIONS_UPDATE,
    content: {
      connectionIds: activeConnections.map((ws) => ws.data.wsId),
    },
  };

  server.publish(topics.gameRoom, JSON.stringify(message));
  console.log(`WebSocket active connections ${options?.add ? 'add' : 'remove'} update sent`);
}

export const setRoutes = (server: Bun.Server, app: Hono, settings: ServerSettings) => {
  app.get(
    '/chat',
    (c) => {
      return c.json(chatHistory);
    })
    .post(
      '/chat',
      vValidator('json', ChatMessageSchema, (result, c: Context<{ Variables: { wsId: string } }>) => {
        if (result.success) {
          const authHeader = c.req.header('authorization')
          if (validateAuthHeader(authHeader)) {
            const token = authHeader!.split(' ').pop()
            const wsId = verifyWsIdToken(token!, settings.SECRET_KEY)
            const ws = activeConnections.find((ws) => wsId == ws.data.wsId)
            if (ws && [0, 1].includes(activeConnections.indexOf(ws))) {
              // Is player and allowed to chat
              c.set('wsId', wsId!);
              return undefined
            }
          }
        }
        return c.json({ ok: false }, 400);
      }),
      async (c) => {
        const params = c.req.valid('json');
        const wsId = c.get('wsId');

        const message: ChatMessageType = {
          type: messageTypes.CHAT_UPDATE,
          content: {
            ...params,
            userId: wsId
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
          const token = createWsIdToken(wsId, settings.SECRET_KEY)
          //
          rawWs.data.wsId = wsId
          rawWs.data.token = token

          // Update subscriptions
          rawWs.subscribe(topics.gameRoom);

          // Connect user
          const connectedMessage: ConnectedMessageType = {
            type: messageTypes.CONNECTED,
            content: {
              userId: wsId,
              token: token
            },
          };
          ws.send(JSON.stringify(connectedMessage));
          console.log(`WebSocket ${rawWs.data.wsId} opened and subscribed to topics`);

          // Update connectionIds
          updateActiveConnections(server, { add: rawWs })
        },
        onClose(_, ws) {
          const rawWs = ws.raw!;

          // Update subscriptions
          rawWs.unsubscribe(topics.gameRoom);

          console.log(
            `WebSocket ${rawWs.data?.wsId} closed and unsubscribed from topics`
          );

          // Update connectionIds
          updateActiveConnections(server, { remove: rawWs })
        },
      }
    })
  );

}