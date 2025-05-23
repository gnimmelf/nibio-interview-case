import * as v from "valibot";
import { css } from "styled-system/css";

import {
  ChatFormValues,
  ChatMessageSchema,
  PlayerMoveFormValues,
  PlayerMoveSchema,
} from "../../shared/types";
import { config } from "../constants";
import { useConnection } from "./ConnectionProvider";
import { Chat } from "./Chat";
import { Game } from "./Game";

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
    paddingX: "{2}",
    display: "flex",
    justifyContent: "space-evenly",
    gap: "{2}",
  }),
};

/**
 * Component housing chat and game
 */
export const GameRoom: React.FC<{}> = ({}) => {
  const { authData, connectionInfo } = useConnection();

  const postPlayerMove = async (moveValues: PlayerMoveFormValues) => {
    try {
      const validatedValues = v.parse(PlayerMoveSchema, moveValues);
      const response = await fetch(`${config.BACKEND_URL}/move`, {
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

  const { connectionCount } = connectionInfo || {};

  return (
    <section className={styles.container}>
      <div className={styles.gameClient}>
        <div className={styles.gameInfo}>
          <div>
            Connection{connectionCount ? "s" : ""}: {connectionCount}
          </div>
          <span>
            <span>You are {connectionInfo?.title}</span>
            {connectionInfo?.isPlayer && (
              <span>
                {" - "}
                {connectionInfo?.isActivePlayer
                  ? "Your move!"
                  : "Awaiting your turn..."}
              </span>
            )}
          </span>
        </div>
        <Game postMove={postPlayerMove} />
      </div>
      <div>
        <Chat postMessage={postChatMessage} />
      </div>
    </section>
  );
};
