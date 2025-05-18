import * as v from 'valibot';
import { publishActions } from './constants';

export const MessageFormSchema = v.object({
  userId: v.pipe(v.string(), v.minLength(1)),
  text: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

export type MessageFormValues = v.InferInput<typeof MessageFormSchema>;

type PublishAction = (typeof publishActions)[keyof typeof publishActions];

export type Message = { id: number; date: string } & MessageFormValues;

export type DataToSend = {
  action: PublishAction;
  message: Message;
};