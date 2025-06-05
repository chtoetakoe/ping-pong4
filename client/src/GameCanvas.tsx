import { useEffect, useRef } from 'react';

type GameState = {
  players: { id: string; paddleY: number }[];
  ball: { x: number; y: number };
  score: { left: number; right: number };
};

type Props = {
  gameState: GameState | null;
};

const GameCanvas = ({ gameState }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!gameState || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 800, 600);

    // Draw background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 800, 600);

    // Draw ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw paddles
    gameState.players.forEach((player, index) => {
      const x = index === 0 ? 20 : 760;
      ctx.fillStyle = '#0f0';
      ctx.fillRect(x, player.paddleY, 10, 80);
    });

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.fillText(`${gameState.score.left}`, 300, 50);
    ctx.fillText(`${gameState.score.right}`, 480, 50);

  }, [gameState]);

  return <canvas ref={canvasRef} width={800} height={600} style={{ display: 'block', margin: 'auto' }} />;
};

export default GameCanvas;
