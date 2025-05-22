import React, { ChangeEvent, FormEvent, useState } from "react";
import { css, cx } from "styled-system/css";
import { Input } from "./Input";
import { Button } from "./Button";

import { ChatFormValues } from "../../shared/types";
import { ChatBubble } from "./ChatBubble";
import { useGame } from "./ConnectionProvider";
import { getPlayerInfo } from "~/lib/utils";

const styles = {
  splitGridV: css({
    display: "grid",
    gridTemplateRows: "1fr auto",
    height: "full",
    "& > :last-child": {
      width: "sm",
      overflowY: "auto",
    },
    "& > *": {
      minHeight: 0,
      height: "full",
    },
  }),
  chatContainer: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "end",
  }),
  chatForm: css({
    display: "flex",
    "&>*": {
      flexGrow: '1'
    },
  }),
};

export const Chat: React.FC<{
  postMessage: (messageData: ChatFormValues) => Promise<boolean>;
}> = ({ postMessage }) => {
  const { connectionIds, authData, connectionData, chatMessages } = useGame();

  const initialValues: ChatFormValues = {
    text: "Test message",
  };

  const [formValues, setFormValues] = useState<ChatFormValues>(initialValues);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await postMessage(formValues);
    if (success) {
      // Reset input
      setFormValues(initialValues);
    }
  };

  const userId = authData?.userId!;
  const isPlayer = Boolean(connectionData?.isPlayer);

  return (
    <section className={styles.splitGridV}>
      <div className={styles.chatContainer}>
        {chatMessages.map((message, idx) => {
          const playerInfo = getPlayerInfo(message.userId, connectionIds);
          return (
            (playerInfo.isPlayer || playerInfo.isSpectator) && (
              <div key={idx} data-user-id={message.userId}>
                <ChatBubble
                  text={message.text}
                  isFromMe={message.userId == userId}
                  {...playerInfo}
                />
              </div>
            )
          );
        })}
      </div>
      {isPlayer && (
        <form method="post" onSubmit={handleSubmit} className={styles.chatForm}>
          <Input
            name="text"
            value={formValues.text}
            onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </form>
      )}
    </section>
  );
};
