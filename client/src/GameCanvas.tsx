import { useEffect, useRef } from 'react';

/* types that include side */
type Player = { id: string; paddleY: number; side: 'left' | 'right' };
type Ball   = { x: number; y: number };
type Score  = { left: number; right: number };
type GameState = { players: Player[]; ball: Ball; score: Score };

const GameCanvas = ({ gameState }: { gameState: GameState | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d');
    if (!canvas || !ctx || !gameState) return;

    let raf: number;

    const draw = () => {
      const { ball, players, score } = gameState;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* ball */
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      ctx.fill();

      /* paddles by side */
      players.forEach((p) => {
        const x = p.side === 'left' ? 20 : 770;
        ctx.fillStyle = '#0f0';
        ctx.fillRect(x, p.paddleY, 10, 80);
      });

      /* score */
      ctx.fillStyle = '#fff';
      ctx.font = '30px Arial';
      ctx.fillText(`${score.left}`, 300, 50);
      ctx.fillText(`${score.right}`, 480, 50);

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ display: 'block', margin: '20px auto', border: '2px solid #fff', background: '#000' }}
    />
  );
};

export default GameCanvas;
