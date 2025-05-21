import * as v from 'valibot';
import { messageTypes } from './constants';


// Chat
export const ChatMessageSchema = v.object({
  text: v.pipe(v.string(), v.trim(), v.minLength(1)),
});
export type ChatFormValues = v.InferInput<typeof ChatMessageSchema>;
export type ChatMessage = ChatFormValues & {
  userId: string
}

// Connected
export type ConnectedMessage = {
  userId: string
  token: string
}

// Move
export const MoveMessageSchema = v.object({
  x: v.pipe(v.number()),
  y: v.pipe(v.number())
});
export type MoveFormValues = v.InferInput<typeof MoveMessageSchema>;
export type MoveMessage = MoveFormValues & {
  userId: string
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