import * as v from 'valibot';
import { messageTypes } from './constants';

export const ChatMessageSchema = v.object({
  userId: v.pipe(v.string(), v.trim(), v.minLength(1)),
  text: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Chat
export type ChatMessage = v.InferInput<typeof ChatMessageSchema>;

// Connected
export type ConnectedMessage = any

// Move
export type MoveMessage = {
  x: number
  y: number
}

// Define discriminated union types
export type ChatMessageType = {
  type: typeof messageTypes.UPDATE_CHAT;
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

export type Message =
  | ChatMessageType
  | PlayerMoveMessageType
  | ConnectedMessageType;