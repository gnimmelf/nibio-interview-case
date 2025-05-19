import * as v from "valibot";
import { css } from "styled-system/css";
import { useTheme } from "./ThemeProvider";

import { messageTypes } from "../../shared/constants";
import {
  ChatMessage,
  ChatMessageSchema,
  ChatMessage,
  MessageData,
} from "../../shared/types";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

const styles = {
  container: css({
    padding: "{2}",
  }),
};

const config = {
  FRONTEND_URL: process.env.FRONTEND_URL!,
  BACKEND_URL: process.env.BACKEND_URL!,
  BACKEND_WS_URL: process.env.BACKEND_WS_URL!,
  BACKEND_PORT: process.env.BACKEND_URL!.split(":")[2],
};

console.log({ config });

const initialValues: ChatMessage = {
  userId: Math.random().toString(36).slice(-8),
  text: "Test message",
};

export const GoGame: React.FC<{}> = ({}) => {
  const theme = useTheme();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [formValues, setFormValues] =
    useState<ChatMessage>(initialValues);
  const [formErrors, setFormErrors] = useState<
    v.ValiError<typeof ChatMessageSchema>[]
  >([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`${config.BACKEND_URL}/messages`);
      if (!response.ok) {
        console.error("Failed to fetch messages");
        return;
      }
      const messages: ChatMessage[] = await response.json();
      setMessages(messages);
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${config.BACKEND_WS_URL}/ws`);

    socket.onopen = (event) => {
      console.log("WebSocket client opened", event);
    };

    socket.onmessage = (event) => {
      try {
        const data: MessageData = JSON.parse(event.data.toString());
        switch (data.type) {
          case messageTypes.UPDATE_CHAT:
            setMessages((prev) => [...prev, data.message]);
            break;
          case messageTypes.PLAYER_MOVE:
            // TODO! Update player move
            break;
          default:
            console.error("Unknown data:", data);
        }
      } catch (_) {
        console.log("ChatMessage from server:", event.data);
      }
    };

    socket.onclose = (event) => {
      console.log("WebSocket client closed", event);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validatedValues = v.parse(ChatMessageSchema, formValues);
      const response = await fetch(`${config.BACKEND_URL}/messages`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(validatedValues),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      setFormValues(initialValues);
      setFormErrors([]);
    } catch (error) {
      if (error instanceof v.ValiError) {
        console.error("Form validation errors:", error.issues);
        setFormErrors(error.issues);
      } else {
        console.error("Error:", error);
      }
    }
  };

  return (
    <section className={styles.container}>
      {JSON.stringify(messages)}
      <form
        method="post"
        onSubmit={handleSubmit}
        className="flex items-center space-x-2"
      >
        <Input name="userId" defaultValue={formValues.userId} hidden />
        <Input
          name="text"
          value={formValues.text}
          onChange={handleInputChange}
        />
        <Button type="submit">Send</Button>
      </form>
    </section>
  );
};
