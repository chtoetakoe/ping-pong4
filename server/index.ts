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

// Map of roomId -> GameRoom instance
const rooms: Record<string, GameRoom> = {};

io.on('connection', (socket) => {
  console.log('🎮 Player connected:', socket.id);

  // Try to find a room with only 1 player
  let room = Object.values(rooms).find(r => r.getState().players.length < 2);

  // If none found, create new room
  if (!room) {
    room = new GameRoom(`room-${socket.id}`);
    rooms[room.roomId] = room;
  }

  // Add player and join room
  room.addPlayer(socket.id);
  socket.join(room.roomId);
  console.log(`👥 Player ${socket.id} joined ${room.roomId}`);

  // Paddle movement from client
  socket.on('paddleMove', (newY: number) => {
    room?.updatePaddle(socket.id, newY);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    room?.removePlayer(socket.id);
    console.log('🚪 Player disconnected:', socket.id);

    // Clean up room if empty
    if (room && room.getState().players.length === 0) {
      delete rooms[room.roomId];
      console.log(`🧹 Deleted empty room ${room.roomId}`);
    }
  });
});

// Broadcast game state to all players 60 times per second
setInterval(() => {
  for (const room of Object.values(rooms)) {
    room.updateGameLogic();
    io.to(room.roomId).emit('gameState', room.getState());
  }
}, 1000 / 60);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
