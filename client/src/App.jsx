import { useEffect } from "react";
import "./App.css";
import axios from "axios";
import { io } from "socket.io-client";

function App() {

  const fetchAPI = async () => {
    await axios.get("http://localhost:8080");
  };

  useEffect(() => {
    fetchAPI();

    const socket = io("http://localhost:8080");

    io.on('connection', (socket) => {
      console.log('New user connected with ID:', socket.id);
    
      socket.on('join-queue', () => {
        queue.push(socket);
        console.log(`User joined the queue. Queue length: ${queue.length}`);
        io.to(socket.id).emit('queue-status', 'You are in the queue.');
    
        if (queue.length >= 2) {
          const user1 = queue.shift();
          const user2 = queue.shift();
    
          const roomId = `${user1.id}-${user2.id}`;
          console.log(`Creating room ${roomId} for users ${user1.id} and ${user2.id}`);
    
          user1.join(roomId);
          user2.join(roomId);
    
          io.to(user1.id).emit('match-found', { roomId });
          io.to(user2.id).emit('match-found', { roomId });
    
          activeChats[user1.id] = roomId;
          activeChats[user2.id] = roomId;
    
          console.log(`Match found between ${user1.id} and ${user2.id} in room: ${roomId}`);
        }
      });
    
      socket.on('leave-queue', () => {
        queue = queue.filter(s => s.id !== socket.id);
        console.log(`User left the queue. Queue length: ${queue.length}`);
        io.to(socket.id).emit('queue-error', 'Queue cancelled.');
      });
    
      socket.on('send-message', ({ message, roomId }) => {
        if (roomId) {
          console.log(`Sending message to room: ${roomId}`);
          io.to(roomId).emit('receive-message', message);
        } else {
          console.log('No roomId found for sending message.');
        }
      });
    
      socket.on('end-chat', () => {
        const roomId = activeChats[socket.id];
        if (roomId) {
          io.to(roomId).emit('queue-status', 'Chat ended.');
          socket.leave(roomId);
    
          const otherUserId = roomId.split('-').filter(id => id !== socket.id)[0];
          if (otherUserId) {
            io.to(otherUserId).emit('queue-status', 'Chat ended.');
          }
          delete activeChats[socket.id];
          delete activeChats[otherUserId];
        }
      });
    
      socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        queue = queue.filter(s => s.id !== socket.id);
    
        const roomId = activeChats[socket.id];
        if (roomId) {
          socket.leave(roomId);
    
          const otherUserId = roomId.split('-').filter(id => id !== socket.id)[0];
          if (otherUserId) {
            io.to(otherUserId).emit('queue-status', 'Your partner has disconnected.');
          }
          delete activeChats[socket.id];
          delete activeChats[otherUserId];
        }
      });
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      
    </>
  );
}

export default App;
