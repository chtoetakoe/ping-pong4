import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameRoom } from './game';

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST']
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;
const rooms: Record<string, GameRoom> = {};

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Find or create a room
  let room = Object.values(rooms).find(r => r.getState().players.length < 2);
  if (!room) {
    room = new GameRoom(`room-${socket.id}`);
    rooms[room.roomId] = room;
  }

  room.addPlayer(socket.id);
  socket.join(room.roomId);
  console.log(`Player ${socket.id} joined ${room.roomId}`);

  // Handle paddle movement
  socket.on('paddleMove', (newY: number) => {
    room?.updatePaddle(socket.id, newY);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    room?.removePlayer(socket.id);
    console.log('Player disconnected:', socket.id);
  });
});

// Broadcast game state at 60 FPS
setInterval(() => {
  for (const room of Object.values(rooms)) {
    room.updateGameLogic();
    io.to(room.roomId).emit('gameState', room.getState());
  }
}, 1000 / 60);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
