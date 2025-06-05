import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import GameCanvas from './GameCanvas';

type Player = {
  id: string;
  paddleY: number;
};

type Ball = {
  x: number;
  y: number;
};

type Score = {
  left: number;
  right: number;
};

type GameState = {
  players: Player[];
  ball: Ball;
  score: Score;
};

const socket: Socket = io('http://localhost:3000');

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    // Join an open room
    socket.emit('joinRoom');

    // Listen for state updates
    socket.on('gameState', (state: GameState) => {
      setGameState(state);
    });

    // Handle key presses for paddle movement
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        socket.emit('paddleMove', -10);
      } else if (e.key === 'ArrowDown') {
        socket.emit('paddleMove', 10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: 'white' }}>Multiplayer Pong</h1>
      <GameCanvas gameState={gameState} />
    </div>
  );
}

export default App;
