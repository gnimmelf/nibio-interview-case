import * as v from "valibot";
import { css } from "styled-system/css";

import {
  ChatFormValues,
  ChatMessageSchema,
  MoveFormValues,
  MoveMessageSchema,
} from "../../shared/types";
import { Chat } from "./Chat";
import { useGame } from "./ConnectionProvider";
import { config } from "../constants";
import { GameBoard } from "./GameBoard";

const styles = {
  container: css({
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
  gameClient: css({
    display: "flex",
    flexDirection: "column",
  }),
  gameInfo: css({
    paddingX: '{2}',
    display: 'flex',
    gap: '{2}',
  })
};

export const GameRoom: React.FC<{}> = ({}) => {
  const { authData, connectionData } = useGame();

  const postPlayerMove = async (moveValues: MoveFormValues) => {
    try {
      const validatedValues = v.parse(ChatMessageSchema, moveValues);

      // TBD
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
    return true;
  };

  const postChatMessage = async (messageValues: ChatFormValues) => {
    try {
      const validatedValues = v.parse(ChatMessageSchema, messageValues);

      const response = await fetch(`${config.BACKEND_URL}/chat`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData!.token}`,
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

  const {connectionCount}=connectionData || {}

  return (
    <section className={styles.container}>
      <div className={styles.gameClient}>
        <div className={styles.gameInfo}>
          <span>You are{" "} {connectionData?.title}</span>
          <span>Connection{connectionCount ? 's' : ''}: {connectionCount}</span>
        </div>
        <GameBoard />
      </div>
      <div>
        <Chat postMessage={postChatMessage} />
      </div>
    </section>
  );
};
