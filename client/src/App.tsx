import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import GameCanvas from './GameCanvas';

type Player = { id: string; paddleY: number };
type Ball   = { x: number; y: number };
type Score  = { left: number; right: number };
type GameState = { players: Player[]; ball: Ball; score: Score };

const socket: Socket = io('http://localhost:3000');

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    /* ✅ wait until the socket is connected */
    socket.on('connect', () => {
      console.log('🔗 connected, joining room …');
      socket.emit('joinRoom');
    });

    /* state updates */
    socket.on('gameState', (state: GameState) => {
      console.log('📦 state', state);          // you should now see these logs
      setGameState(state);
    });

    /* paddle controls */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp'   || e.key === 'w') socket.emit('paddleMove', -10);
      if (e.key === 'ArrowDown' || e.key === 's') socket.emit('paddleMove',  10);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      socket.off('connect');
      socket.off('gameState');
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
