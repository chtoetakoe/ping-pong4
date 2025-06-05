import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

type Player = { id: string; paddleY: number };
type Ball = { x: number; y: number; vx: number; vy: number };
type Score = { left: number; right: number };
type GameRoom = { players: Player[]; ball: Ball; score: Score };

const rooms = new Map<string, GameRoom>();
const FRAME_RATE = 60;
const PADDLE_HEIGHT = 80;
const CANVAS_HEIGHT = 600;

// 🎮 Game loop
setInterval(() => {
  for (const [roomId, room] of rooms.entries()) {
    const { ball, players, score } = room;

    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall bounce
    if (ball.y <= 0 || ball.y >= CANVAS_HEIGHT) ball.vy *= -1;

    // Paddle bounce
    if (players[0] && ball.x <= 30 && ball.y >= players[0].paddleY && ball.y <= players[0].paddleY + PADDLE_HEIGHT)
      ball.vx *= -1;

    if (players[1] && ball.x >= 770 && ball.y >= players[1].paddleY && ball.y <= players[1].paddleY + PADDLE_HEIGHT)
      ball.vx *= -1;

    // Score
    if (ball.x < 0) {
      score.right++;
      ball.x = 400;
      ball.y = 300;
    } else if (ball.x > 800) {
      score.left++;
      ball.x = 400;
      ball.y = 300;
    }

    // Broadcast state
    io.to(roomId).emit('gameState', {
      players,
      ball: { x: ball.x, y: ball.y },
      score,
    });
  }
}, 1000 / FRAME_RATE);

// 🔌 Client connection
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('joinRoom', () => {
    let assignedRoom = null;

    // Find room with 1 player
    for (const [roomId, room] of rooms.entries()) {
      if (room.players.length === 1) {
        assignedRoom = roomId;
        room.players.push({ id: socket.id, paddleY: 250 });
        socket.join(roomId);
        console.log(`Player ${socket.id} joined existing room: ${roomId}`);
        break;
      }
    }

    // If no available room, create new
    if (!assignedRoom) {
      const newRoomId = `room-${socket.id}`;
      const newRoom: GameRoom = {
        players: [{ id: socket.id, paddleY: 250 }],
        ball: { x: 400, y: 300, vx: 4, vy: 3 },
        score: { left: 0, right: 0 },
      };
      rooms.set(newRoomId, newRoom);
      socket.join(newRoomId);
      console.log(`Player ${socket.id} created new room: ${newRoomId}`);
    }
  });

  socket.on('paddleMove', (deltaY: number) => {
    for (const room of rooms.values()) {
      const player = room.players.find((p) => p.id === socket.id);
      if (player) {
        player.paddleY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, player.paddleY + deltaY));
        break;
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    for (const [roomId, room] of rooms.entries()) {
      room.players = room.players.filter((p) => p.id !== socket.id);
      if (room.players.length === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} deleted due to no players`);
      }
    }
  });
});

server.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
