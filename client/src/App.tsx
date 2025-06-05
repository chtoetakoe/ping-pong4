import { useState } from 'react';
import { useSocket } from './useSocket';
import GameCanvas from './GameCanvas';

function App() {
  const [gameState, setGameState] = useState<any>(null);

  useSocket((data) => {
    console.log("📦 Received game state:", data);
    setGameState(data);
  });

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'white' }}>Multiplayer Pong</h1>
      <pre style={{ background: '#111', color: '#0f0', padding: '1rem' }}>
        {JSON.stringify(gameState, null, 2)}
      </pre>
      <GameCanvas gameState={gameState} />
    </div>
  );
}

export default App;
