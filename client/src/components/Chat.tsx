import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { css } from "styled-system/css";
import { Input } from "./Input";
import { Button } from "./Button";

import { ChatMessage } from "../../shared/types";

const styles = {
  container: css({
    padding: "{2}",
  }),
};

export const Chat: React.FC<{
  userId: string;
  messages: ChatMessage[];
  postMessage: (messageData: ChatMessage) => Promise<boolean>;
}> = ({ userId, messages, postMessage }) => {
  const initialValues: ChatMessage = {
    userId,
    text: "Test message"
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
      userId
  });
    if (success) {
      // Reset input
      setFormValues(initialValues);
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
