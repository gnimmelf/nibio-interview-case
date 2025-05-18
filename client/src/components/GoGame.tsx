import * as v from 'valibot'
import { css } from "styled-system/css";
import { useTheme } from "./ThemeProvider";


import { Message, MessageFormSchema, MessageFormValues } from '../../shared/types'
import { useEffect, useState } from "react";

const styles = {
  container: css({
    padding: "{2}",
  })
}

const config = {
  FRONTEND_URL: process.env.FRONTEND_URL!,
  BACKEND_URL: process.env.BACKEND_URL!,
  BACKEND_WS_URL: process.env.BACKEND_WS_URL!,
  BACKEND_PORT: process.env.BACKEND_URL!.split(':')[2],
}

console.log({ config })

const initialValues: MessageFormValues = {
  userId: Math.random().toString(36).slice(-8),
  text: '',
};

export const GoGame: React.FC<{}> = ({}) => {
  const theme = useTheme();

  const [messages, setMessages] = useState<Message[]>([]);
  const [formValues, setFormValues] = useState<MessageFormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<v.ValiError<typeof MessageFormSchema>[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`${config.BACKEND_URL}/messages`);
      if (!response.ok) {
        console.error('Failed to fetch messages');
        return;
      }
      const messages: Message[] = await response.json();
      setMessages(messages);
    };

    fetchMessages();
  },[])

  return (
    <section className={styles.container}>
      {JSON.stringify(messages)}
    </section>
  )
}