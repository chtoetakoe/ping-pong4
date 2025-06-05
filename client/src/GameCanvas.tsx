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
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx || !gameState || !gameState.ball) return;   
      
    

    let animationFrameId: number;

    const render = () => {
      const { ball, players, score } = gameState;

      // Clear and background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ball
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Paddles
      players.forEach((player, index) => {
        const x = index === 0 ? 20 : 770;
        ctx.fillStyle = '#0f0';
        ctx.fillRect(x, player.paddleY, 10, 80);
      });

      // Score
      ctx.fillStyle = '#fff';
      ctx.font = '30px Arial';
      ctx.fillText(`${score.left}`, 300, 50);
      ctx.fillText(`${score.right}`, 480, 50);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
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
        backgroundColor: '#000',
      }}
    />
  );
};

export default GameCanvas;
