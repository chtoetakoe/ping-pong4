import { useState } from 'react';
import { useSocket } from './useSocket';
import GameCanvas from './GameCanvas';

function App() {
  const [gameState, setGameState] = useState<any>(null);
  useSocket(setGameState);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Multiplayer Pong</h1>
      <GameCanvas gameState={gameState} />
    </div>
  );
}

export default App;
