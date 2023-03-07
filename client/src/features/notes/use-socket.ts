import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:4000" 
  : "https://notehub.app";

const useSocket = (noteId: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      transports: ['websocket'],
    });
    console.log('attempting to connect to ' + SERVER_URL);

    newSocket.on('connect', () => {
      console.log('Socket connected');
      newSocket.emit('join', noteId);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    newSocket.on('error', (error) => {
      console.log('Socket error', error);
    })

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up socket');
      newSocket.disconnect();
    };
  }, [noteId]);

  return socket;
};

export default useSocket;
