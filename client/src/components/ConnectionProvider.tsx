import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  messageTypes,
} from "../../shared/constants";
import type {
  ChatMessage,
  ConnectedMessage,
  ConnectionId,
  GameState,
  Message,
} from "../../shared/types";
import { getPlayerInfo } from "~/lib/utils";
import { backendUrl } from "~/constants";

// Define the theme context types
type ConnectionInfo = {
  title: string;
  isPlayer: boolean;
  isSpectator: boolean;
  isActivePlayer: boolean
  playerNo: number
  connectionCount: number
};

interface ConnectionContextType {
  authData?: ConnectedMessage;
  connectionInfo?: ConnectionInfo;
  gameState?: GameState
  chatMessages: ChatMessage[];
  connectionIds: string[];
}
// Create the theme context
const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

// Theme provider component
export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [authData, setAuthData] = useState<ConnectedMessage>();
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>();
  const [connectionIds, setConnectionIds] = useState<ConnectionId[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [gameState, setGameState] = useState<GameState>();

  const fetchChatHistory = async () => {
    const response = await fetch(`${backendUrl}/chat`);
    if (!response.ok) {
      console.error("Failed to fetch messages");
      return;
    }
    const chatMessages: ChatMessage[] = await response.json();
    setChatMessages(chatMessages);
  };

  const fetchGameState = async () => {
    const response = await fetch(`${backendUrl}/game`);
    if (!response.ok) {
      console.error("Failed to fetch messages");
      return;
    }
    const gameState: GameState = await response.json();
    setGameState(gameState)
  };


  /**
   * Load messages
   */
  useEffect(() => {
    fetchChatHistory();
    fetchGameState();
  }, [authData]);

  /**
   * Connect Websocket
   */
  useEffect(() => {
    const socket = new WebSocket(`${backendUrl}/ws`);

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
    setConnectionInfo((prev) => {
      const next = {
        connectionCount: connectionIds.length,
        ...getPlayerInfo(authData?.userId!, connectionIds, gameState?.activePlayerNo!)
      } as ConnectionInfo

      return next
    });
  }, [connectionIds, gameState]);

  const connectionData: ConnectionContextType = {
    authData,
    connectionInfo,
    chatMessages,
    connectionIds,
    gameState
  };

  const isLoading = !(authData && connectionInfo);

  return (
    <ConnectionContext.Provider value={connectionData}>
      {isLoading ? null : children}
    </ConnectionContext.Provider>
  );
}

// Custom hook to use the theme context
export function useConnection(): ConnectionContextType {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
}
