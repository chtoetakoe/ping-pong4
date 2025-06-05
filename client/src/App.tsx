import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import GameCanvas from './GameCanvas';

/* types with side */
type Player    = { id: string; paddleY: number; side: 'left' | 'right' };
type Ball      = { x: number; y: number };
type Score     = { left: number; right: number };
type GameState = { players: Player[]; ball: Ball; score: Score };

const socket: Socket = io('http://localhost:3000');

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [mySide, setMySide]       = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    /* gameState listener */
    socket.on('gameState', (state: GameState) => {
      setGameState(state);
      const me = state.players.find(p => p.id === socket.id);
      if (me) setMySide(me.side);
    });

    /* controls (only move own paddle) */
    const STEP = 12;
    const keys = { up: false, down: false };

    const down = (e: KeyboardEvent) => {
      if (['ArrowUp','w'].includes(e.key))   { e.preventDefault(); keys.up   = true; }
      if (['ArrowDown','s'].includes(e.key)) { e.preventDefault(); keys.down = true; }
    };
    const up = (e: KeyboardEvent) => {
      if (['ArrowUp','w'].includes(e.key))   keys.up   = false;
      if (['ArrowDown','s'].includes(e.key)) keys.down = false;
    };
    window.addEventListener('keydown', down, true);
    window.addEventListener('keyup',   up,   true);

    let raf: number;
    const loop = () => {
      if (mySide) {                      // only after we know our side
        if (keys.up)   socket.emit('paddleMove', -STEP);
        if (keys.down) socket.emit('paddleMove',  STEP);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('keydown', down, true);
      window.removeEventListener('keyup',   up,   true);
      cancelAnimationFrame(raf);
      socket.off('gameState');
    };
  }, [mySide]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: 'white' }}>Multiplayer Pong</h1>
      {gameState && <GameCanvas gameState={gameState} />}
      {mySide && <p style={{ color: 'white' }}>You are playing on the <b>{mySide}</b></p>}
    </div>
  );
}

export default App;
