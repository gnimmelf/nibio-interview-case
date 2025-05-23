import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { messageTypes } from "../../shared/constants";
import type {
  ChatMessage,
  ConnectedMessage,
  ConnectionId,
  GameState,
  Message,
} from "../../shared/types";
import { config } from "../constants";
import { getPlayerInfo } from "~/lib/utils";

// Define the theme context type
type ConnectionData = {
  title: string;
  isPlayer: boolean;
  playerNo: number
  connectionCount: number
};

interface ConnectionContextType {
  authData?: ConnectedMessage;
  connectionData?: ConnectionData;
  gameState?: GameState
  chatMessages: ChatMessage[];
  connectionIds: string[];
}

// Create the theme context
const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

// Theme provider component
export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [authData, setAuthData] = useState<ConnectedMessage>();
  const [connectionData, setConnectionData] = useState<ConnectionData>();
  const [connectionIds, setConnectionIds] = useState<ConnectionId[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [gameState, setGameState] = useState<GameState>();


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
  }, [authData]);

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
            setAuthData(message.content);
            break;
          case messageTypes.CONNECTIONS_UPDATE:
            setConnectionIds(message.content.connectionIds);
            break;
          case messageTypes.CHAT_UPDATE:
            setChatMessages((prev) => [...prev, message.content]);
            break;
          case messageTypes.GAME_UPDATE:
            setGameState(message.content)
            break;
          default:
            console.error("Unknown data:", message);
        }
      } catch (_) {
        console.log("ChatFormValues from server:", event.data);
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
   * Set derived connection data
   */
  useEffect(() => {
    setConnectionData((prev) => {
      const next = {
        connectionCount: connectionIds.length,
        ...getPlayerInfo(authData?.userId!, connectionIds)
      } as ConnectionData

      return next
    });
  }, [connectionIds]);

  const gameData: ConnectionContextType = {
    authData,
    connectionData,
    chatMessages,
    connectionIds,
    gameState
  };

  const isLoading = !(authData && connectionData);

  return (
    <ConnectionContext.Provider value={gameData}>
      {isLoading ? null : children}
    </ConnectionContext.Provider>
  );
}

// Custom hook to use the theme context
export function useGame(): ConnectionContextType {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useGame must be used within a ConnectionProvider");
  }
  return context;
}
