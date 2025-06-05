import { useState } from 'react';
import { useSocket } from './useSocket';

function App() {
  const [gameState, setGameState] = useState<any>(null);

  // Establish socket connection and listen for game state
  useSocket((data) => {
    setGameState(data);
  });

  return (
    <div>
      <h1>Multiplayer Pong</h1>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
    </div>
  );
}

export default App;
