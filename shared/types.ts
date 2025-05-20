import * as v from 'valibot';
import { messageTypes } from './constants';

export const ChatMessageSchema = v.object({
  userId: v.pipe(v.string(), v.trim(), v.minLength(1)),
  text: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Chat
export type ChatMessage = v.InferInput<typeof ChatMessageSchema>;

// Connected
export type ConnectedMessage = {
  userId: string
}

// Move
export type MoveMessage = {
  userId: string
  x: number
  y: number
}


// Connection status update
export type ConnectionId = string
export type ConnectionsMessage = {
  connectionIds: ConnectionId[]
}

/**
 * Define discriminated union types
 */
export type ChatMessageType = {
  type: typeof messageTypes.CHAT_UPDATE;
  content: ChatMessage;
};

export type PlayerMoveMessageType = {
  type: typeof messageTypes.PLAYER_MOVE;
  content: MoveMessage;
};

export type ConnectedMessageType = {
  type: typeof messageTypes.CONNECTED;
  content: ConnectedMessage;
};

export type ConnectionsMessageType = {
  type: typeof messageTypes.CONNECTIONS_UPDATE;
  content: ConnectionsMessage;
};

export type Message =
  | ChatMessageType
  | PlayerMoveMessageType
  | ConnectedMessageType
  | ConnectionsMessageType