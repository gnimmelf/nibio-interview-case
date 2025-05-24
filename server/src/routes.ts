import { randomUUID } from 'crypto'
import { Hono, type Context } from 'hono';
import { vValidator } from '@hono/valibot-validator';
import { createBunWebSocket } from 'hono/bun';
import type { ServerWebSocket } from 'bun';

import {
  createWsIdToken,
  validateAuthHeader,
  verifyWsIdToken
} from './utils';
import type {
  ChatMessageType,
  ConnectedMessageType,
  ConnectionsMessageType,
  ChatMessage,
  GameStateMessageType,
  GameState,
  PlayerMoveFormValues,
} from '../shared/types';
import { ChatMessageSchema, PlayerMoveSchema } from '../shared/types'
import { BOARD_SIZE, messageTypes } from '../shared/constants';
import type { EnvVars } from './app';

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
 * TODO! Wrap in classes to encapsulate logic, especially `gameStat` and game rules.
 */
let chatHistory: ChatMessage[] = [];
let activeConnections: WsInstance[] = []
let gameState: GameState = {
  activePlayerNo: 1,
  boardState: Array(BOARD_SIZE * BOARD_SIZE).fill(0)
}

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
    const removedWsId = options.remove!.data.wsId
    // Remove connection
    activeConnections = activeConnections.filter((ws) => {
      return ws.data.wsId !== removedWsId;
    });
    // Clean up chat history
    chatHistory = chatHistory.filter(({ userId }) => userId != removedWsId)
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

/**
 * Set up app routes
 * @param server Bun server instance
 * @param app Hono app instance
 * @param envVars ports and stuff
 */
export const setupAppRoutes = (server: Bun.Server, app: Hono, envVars: EnvVars) => {

  const validatePostMessage = (schema: any) => {
    return vValidator('json', schema, (result, c: Context<{ Variables: { wsId: string } }>) => {
      if (result.success) {
        const authHeader = c.req.header('authorization');
        if (validateAuthHeader(authHeader)) {
          const token = authHeader!.split(' ').pop();
          const wsId = verifyWsIdToken(token!, envVars.SECRET_KEY);
          const ws = activeConnections.find((ws) => wsId == ws.data.wsId);
          if (ws && [0, 1].includes(activeConnections.indexOf(ws))) {
            c.set('wsId', wsId!);
            return undefined;
          }
        }
      }
      return c.json({ ok: false }, 400);
    });
  };

  // Set up routes
  app
    .get(
      '/chat',
      (c) => {
        return c.json(chatHistory);
      })
    .get(
      '/game',
      (c) => {
        return c.json(gameState);
      })
    .post(
      '/chat',
      validatePostMessage(ChatMessageSchema),
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
    .post(
      '/move',
      validatePostMessage(PlayerMoveSchema),
      async (c) => {
        const params: PlayerMoveFormValues = c.req.valid('json');
        const wsId = c.get('wsId');

        const ws = activeConnections.find((ws) => wsId == ws.data.wsId)!;
        const playerNo = activeConnections.indexOf(ws) + 1

        if (playerNo !== gameState.activePlayerNo) {
          return c.json({
            ok: false,
            message: 'Not your move'
          }, 400);
        }

        if (gameState.boardState[params.tileId]) {
          return c.json({
            ok: false,
            message: 'Tile occupied'
          }, 400);
        }

        // TODO! Game rules check go here

        // Record player move
        gameState.boardState[params.tileId] = playerNo
        // Swap active player
        gameState.activePlayerNo = (playerNo - 1) ? 1 : 2

        const message: GameStateMessageType = {
          type: messageTypes.GAME_UPDATE,
          content: gameState,
        };

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
          const token = createWsIdToken(wsId, envVars.SECRET_KEY)
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