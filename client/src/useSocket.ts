import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (
  onGameState: (data: any) => void
): Socket | null => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('gameState', onGameState);

    return () => {
      socket.disconnect();
    };
  }, [onGameState]);

  return socketRef.current;
};
