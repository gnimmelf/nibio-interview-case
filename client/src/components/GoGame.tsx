import * as v from "valibot";
import { css } from "styled-system/css";

import { ChatFormValues, ChatMessageSchema } from "../../shared/types";
import { Chat } from "./Chat";
import { useGame } from "./GameProvider";
import { config } from "../constants";

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

export const GoGame: React.FC<{}> = ({}) => {
  const { authData, connectionData, chatMessages } = useGame();

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

  return (
    <section className={css({ height: "full" })}>
      <div className={styles.splitGridH}>
        <div>
          <div>
            Board ({connectionData?.connectionCount} connections) - You are{" "}
            {connectionData?.title}
          </div>
        </div>
        <div>
          <Chat postMessage={postChatMessage} />
        </div>
      </div>
    </section>
  );
};
