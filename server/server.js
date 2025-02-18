const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST']
}));

const roomList = ['SummitApparel', 'PinecrestJewelry', 'RidgewayWatches', 'EverbrookAutomobiles', 'StonegateHomeInteriors', 'OakfordFineWines'];

const roomsHistory = {
  SummitApparel: [],
  PinecrestJewelry: [],
  RidgewayWatches: [],
  EverbrookAutomobiles: [],
  StonegateHomeInteriors: [],
  OakfordFineWines: []
};

app.get('/', (req, res) => {
  res.send("Socket.io Server Running");
});

io.on('connection', (socket) => {
  console.log('New user connected with ID:', socket.id);

  socket.emit('chat-history', roomsHistory);

  socket.on('join-room', (room) => {
    if (roomList.includes(room)) {
      socket.join(room);
      console.log(`${socket.id} joined room: ${room}`);

      socket.emit('chat-history', roomsHistory[room]);
    } else {
      socket.emit('error', 'Room not found')
    }
  })

  socket.on('leave-room', (room) => {
    if (roomList.includes(room)) {
      socket.leave(room);
      console.log(`${socket.id} left room: ${room}`)
    } else {
      socket.emit('error', 'Room not found')
    }
  })

  socket.on('send-message', (data) => {
    const { room, message } = data;

    if (roomList.includes(room)) {
      roomsHistory[room].push(message);

      io.to(room).emit('receive-message', message);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});
