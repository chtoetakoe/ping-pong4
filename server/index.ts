import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

/* ─ types ─ */
type Player = { id: string; paddleY: number; side: 'left' | 'right' };
type Ball   = { x: number; y: number; vx: number; vy: number };
type Score  = { left: number; right: number };
type GameRoom = { id: string; players: Player[]; ball: Ball; score: Score };

/* ─ helpers ─ */
const randomVel = (): { vx: number; vy: number } => ({
  vx: Math.random() < 0.5 ? 4 : -4,
  vy: (Math.random() * 4 + 2) * (Math.random() < 0.5 ? 1 : -1),
});

/* ─ constants ─ */
const FRAME = 1000 / 60;
const H = 600, W = 800, PADDLE = 80;

/* ─ state ─ */
let waitingSocket: string | null = null;      // holds 1st player waiting
const rooms = new Map<string, GameRoom>();    // roomId → room

/* ─ game loop ─ */
setInterval(() => {
  for (const room of rooms.values()) {
    const { ball, players, score } = room;

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y <= 0 || ball.y >= H) ball.vy *= -1;

    const L = players.find(p => p.side === 'left');
    const R = players.find(p => p.side === 'right');

    if (L && ball.x <= 30 && ball.y >= L.paddleY && ball.y <= L.paddleY + PADDLE) ball.vx *= -1;
    if (R && ball.x >= W - 30 && ball.y >= R.paddleY && ball.y <= R.paddleY + PADDLE) ball.vx *= -1;

    if (ball.x < 0)  { score.right++; Object.assign(ball, { x: W/2, y: H/2, ...randomVel() }); }
    if (ball.x > W)  { score.left++;  Object.assign(ball, { x: W/2, y: H/2, ...randomVel() }); }

    io.to(room.id).emit('gameState', { players, ball: { x: ball.x, y: ball.y }, score });
  }
}, FRAME);

/* ─ socket handling ─ */
io.on('connection', (socket) => {
  console.log('connect', socket.id);

  /* pairing */
  if (waitingSocket === null) {
    waitingSocket = socket.id;               // first player waits
    socket.join(socket.id);                  // roomId == socket.id
    rooms.set(socket.id, {
      id: socket.id,
      players: [{ id: socket.id, paddleY: 250, side: 'left' }],
      ball: { x: W/2, y: H/2, ...randomVel() },
      score: { left: 0, right: 0 },
    });
    console.log('waiting for opponent…');
  } else {
    const roomId = waitingSocket;
    waitingSocket = null;
    const room = rooms.get(roomId)!;
    room.players.push({ id: socket.id, paddleY: 250, side: 'right' });
    socket.join(roomId);
    console.log(`room ${roomId} ready with two players`);
  }

  /* paddle movement */
  socket.on('paddleMove', (dy: number) => {
    for (const room of rooms.values()) {
      const p = room.players.find(pl => pl.id === socket.id);
      if (p) {
        p.paddleY = Math.max(0, Math.min(H - PADDLE, p.paddleY + dy));
        break;
      }
    }
  });

  /* disconnect */
  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);
    if (waitingSocket === socket.id) waitingSocket = null;

    for (const [id, room] of rooms.entries()) {
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) rooms.delete(id);
    }
  });
});

server.listen(3000, () => console.log('✅ server on :3000'));
