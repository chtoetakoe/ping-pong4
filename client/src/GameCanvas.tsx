import { useEffect, useRef } from 'react';

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

type Props = {
  gameState: GameState | null;
};

const GameCanvas = ({ gameState }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.clear(); // Clear console for readability
    console.log("🔄 useEffect triggered. GameState:", gameState);

    if (!gameState) {
      console.warn("⚠️ No game state received yet.");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("❌ Canvas not found.");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("❌ Canvas context is null.");
      return;
    }

    // Clear and draw background
    ctx.clearRect(0, 0, 800, 600);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 800, 600);

    // Draw ball
    if (gameState.ball) {
      const { x, y } = gameState.ball;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      console.log("⚪ Ball position:", x, y);
    } else {
      console.warn("⚠️ Ball data is missing.");
    }

    // Draw paddles
    gameState.players.forEach((player, index) => {
      const x = index === 0 ? 20 : 770; // left or right side
      const y = player.paddleY;
      ctx.fillStyle = '#0f0';
      ctx.fillRect(x, y, 10, 80);
      console.log(`🟩 Paddle ${index + 1} at Y:`, y);
    });

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.fillText(`${gameState.score.left}`, 300, 50);
    ctx.fillText(`${gameState.score.right}`, 480, 50);
    console.log("🏆 Score:", gameState.score);

  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{
        display: 'block',
        margin: '20px auto',
        border: '2px solid #fff',
        backgroundColor: '#000'
      }}
    />
  );
};

export default GameCanvas;
