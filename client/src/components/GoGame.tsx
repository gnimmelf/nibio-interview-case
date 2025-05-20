import { useEffect, useState } from "react";
import * as v from "valibot";
import { css } from "styled-system/css";

import { messageTypes } from "../../shared/constants";
import {
  ChatMessage,
  ChatMessageSchema,
  ConnectedMessage,
  ConnectionId,
  Message,
} from "../../shared/types";
import { Chat } from "./Chat";

const styles = {
  splitGridH: css({
    display: "grid",
    gridTemplateColumns: {
      base: "1fr", // Stack vertically on base (mobile)
      sm: "1fr auto", // Horizontal split on sm and up
    },
    height: "full",
    "& > :last-child": {
      width: {
        base: "full", // Full width on small screens
        sm: "sm", // Fixed width on larger screens
      },
      overflowY: "auto",
    },
    "& > *": {
      minHeight: 0,
      height: "full",
    },
  }),
};

const config = {
  FRONTEND_URL: process.env.FRONTEND_URL!,
  BACKEND_URL: process.env.BACKEND_URL!,
  BACKEND_WS_URL: process.env.BACKEND_WS_URL!,
  BACKEND_PORT: process.env.BACKEND_URL!.split(":")[2],
};

export const GoGame: React.FC<{}> = ({}) => {
  const [userData, setUserData] = useState<ConnectedMessage>();
  const [userTitle, setUserTitle] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [connectionIds, setConnectionIds] = useState<ConnectionId[]>([]);

  /**
   * Load messages
   */
  useEffect(() => {
    const fetchChatHistory = async () => {
      const response = await fetch(`${config.BACKEND_URL}/chat`);
      if (!response.ok) {
        console.error("Failed to fetch messages");
        return;
      }
      const chatMessages: ChatMessage[] = await response.json();
      setChatMessages(chatMessages);
    };

    fetchChatHistory();
  }, [userData]);

  /**
   * Connect Websocket
   */
  useEffect(() => {
    const socket = new WebSocket(`${config.BACKEND_WS_URL}/ws`);

    socket.onopen = (event) => {
      console.log("WebSocket client opened", event);
    };

    socket.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data.toString());
        switch (message.type) {
          case messageTypes.CONNECTED:
            setUserData(message.content);
            break;
          case messageTypes.CONNECTIONS_UPDATE:
            setConnectionIds(message.content.connectionIds);
            break;
          case messageTypes.CHAT_UPDATE:
            setChatMessages((prev) => [...prev, message.content]);
            break;
          case messageTypes.PLAYER_MOVE:
            // TODO! Update player move
            break;
          default:
            console.error("Unknown data:", message);
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

  /**
   * Set connection title
   * TODO! Move to game context alsng with other props, `isPlayer`, `userData` that are gamewide
   */
  useEffect(() => {
    const userIdx = connectionIds.indexOf(userData?.userId!);
    let title;
    if (userIdx < 2) {
      title = `Player ${userIdx + 1}`;
    } else {
      title = `Spectator ${userIdx - 1}`;
    }
    setUserTitle(title);
  }, [connectionIds]);

  const postChatMessage = async (messageValues: ChatMessage) => {
    try {
      const validatedValues = v.parse(ChatMessageSchema, messageValues);

      const response = await fetch(`${config.BACKEND_URL}/chat`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData!.token}`,
        },
        method: "POST",
        body: JSON.stringify(validatedValues),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
    return true;
  };

  return (
    <section className={css({ height: "full" })}>
      <div className={styles.splitGridH}>
        {userData && (
          <>
            <div style={{maxWidth: '300px', overflowX: 'scroll'}}>
              <div>
                Board ({connectionIds.length} connections) - You are {userTitle}
              </div>
              <pre>{JSON.stringify({ userData, connectionIds }, null, 2)}</pre>
            </div>
            <div>
              <Chat
                userId={userData?.userId!}
                messages={chatMessages}
                postMessage={postChatMessage}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};
