import React, { ChangeEvent, FormEvent, useState } from "react";
import { css, cx } from "styled-system/css";
import { Input } from "./Input";
import { Button } from "./Button";

import { ChatMessage } from "../../shared/types";
import { ChatBubble } from "./ChatBubble";

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end'
  })
};

export const Chat: React.FC<{
  userId: string;
  messages: ChatMessage[];
  postMessage: (messageData: ChatMessage) => Promise<boolean>;
}> = ({ userId, messages, postMessage }) => {
  const initialValues: ChatMessage = {
    userId,
    text: "Test message",
  };

  const [formValues, setFormValues] = useState<ChatMessage>(initialValues);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await postMessage({
      ...formValues,
      userId,
    });
    if (success) {
      // Reset input
      setFormValues(initialValues);
    }
  };

  return (
    <section className={styles.splitGridV}>
      <div class={styles.chatContainer}>
        {messages.map((message) => (
          <div key={message.userId} data-user-id={message.userId}>
            <ChatBubble text={message.text} isFromMe={message.userId == userId} />
          </div>
        ))}
      </div>
      <form
        method="post"
        onSubmit={handleSubmit}
        className="flex items-center space-x-2"
      >
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
