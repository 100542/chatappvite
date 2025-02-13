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

app.use(cors());

app.get('/', (req, res) => {
  res.send("Socket.io Server Running");
});

io.on('connection', (socket) => {
  console.log('New user connected with ID:', socket.id);
});

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});
