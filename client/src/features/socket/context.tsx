import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : window.location.origin;

interface SocketContextProps {
  socket: Socket | null;
  error: string | null;
  emit: (eventName: string, data?: any) => void;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  error: null,
  emit: () => { },
});

export const useSocket = (): SocketContextProps => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: ReactNode;
}

export enum SocketState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

// Create a message queue for outgoing messages
const MESSAGE_QUEUE: { eventName: string; data?: any }[] = [];

const RETRY_INTERVAL = 5000;

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [socketState, setSocketState] = useState<SocketState>(SocketState.DISCONNECTED);

  // State for the emit function, initialized to an empty function
  const emit = (eventName: string, data?: any) => {
    if (socket && socketState === SocketState.CONNECTED) {
      // If socket is connected, emit the message immediately
      socket.emit(eventName, data);
    } else {
      // If socket is not connected, push the message to the queue
      MESSAGE_QUEUE.push({ eventName, data });
    }
  };

  useEffect(() => {
    let socket: Socket;
    let retryTimeout: NodeJS.Timeout;
    const connect = () => {
      socket = io(SOCKET_URL);
      setSocket(socket);

      // When socket connects
      const handleConnect = () => {
        console.log('Connected to socket');
        setError(null);
        setSocketState(SocketState.CONNECTED);

        // Emit messages in queue
        while (MESSAGE_QUEUE.length > 0) {
          const { eventName, data } = MESSAGE_QUEUE.shift()!;
          socket.emit(eventName, data);
        }
      };
      
      // When socket disconnects
      const handleDisconnect = () => {
        console.log('Disconnected from socket');
        setSocketState(SocketState.DISCONNECTED);
        setSocket(null);
        setError('Disconnected from socket');
        if (retryTimeout) {
          clearTimeout(retryTimeout);
        }
      };

      // When there is an error connecting to socket
      const handleError = (err: any) => {
        console.log('Error from socket', err);
        setSocketState(SocketState.DISCONNECTED);
        setError(`Error from socket: ${err.message}`);
        setSocket(null);
        retryTimeout = setTimeout(connect, RETRY_INTERVAL);
        connect();
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('error', handleError);
      return socket;
    }
    connect()

    // Return a cleanup function that disconnects the socket
    return () => {
      console.log('disconnecting socket');
      socket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, error, emit }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
