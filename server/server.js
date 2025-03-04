const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

// Database Configuratie & aanmaken nieuwe DB indien db.sqlite niet gevonden kan worden
const db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)",
      (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
        }
      }
    );
  }
});

// Opstellen server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

// Afhandelen van de signup route
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing username or password" });
  }

  // hashen van het ingevoerde wachtwoord middels de bcrypt library
  const hashedPassword = bcrypt.hashSync(password, 10);

  // inserten van de gebruikersgegevens na de checks.
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: "User already exists or database error" });
      }
      res.json({ success: true, message: "User created" });
    }
  );
});

// afhandelen van de login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // zorgen dat de ingevoerde gegevens matchen met al ingevoerde gegevens
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({ success: true, username: user.username });
    } else {
      // matched niet, opnieuw inloggen
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

// Alle bestaande kamernamen (kan worden uitgebreid indien nodig)
const roomList = ["SummitApparel", "PinecrestJewelry", "RidgewayWatches", "EverbrookAutomobiles", "StonegateHomeInteriors", "OakfordFineWines"];
const roomsHistory = {
  SummitApparel: [],
  PinecrestJewelry: [],
  RidgewayWatches: [],
  EverbrookAutomobiles: [],
  StonegateHomeInteriors: [],
  OakfordFineWines: [],
};

app.get("/", (req, res) => {
  res.send("Socket.io Server Running");
});

// opstarten van de live connectie (socket.io)
io.on("connection", (socket) => {
  console.log("New user connected with ID:", socket.id);

  // inzenden van alle berichten sinds de server aanstaat (als de server uit wordt gezet zijn alle messages gewiped!)
  socket.emit("chat-history", roomsHistory);

  // laat een gebruiker koppelen aan een kamer door middel van zijn socket.id
  socket.on("join-room", (room) => {
    if (roomList.includes(room)) {
      socket.join(room);
      console.log(`${socket.id} joined room: ${room}`);
      socket.emit("chat-history", roomsHistory[room]);
    } else {
      socket.emit("error", "Room not found");
    }
  });

  // zelfde als koppelen aan de kamer
  socket.on("leave-room", (room) => {
    if (roomList.includes(room)) {
      socket.leave(room);
      console.log(`${socket.id} left room: ${room}`);
    } else {
      socket.emit("error", "Room not found");
    }
  });

  // verzenden bericht
  socket.on("send-message", (data) => {
    const { room, message, sender } = data;
  
    // push het bericht naar de juiste kamer
    if (roomList.includes(room)) {
      const messageObject = { sender, message };
      roomsHistory[room].push(messageObject);
  
      // stuur het bericht naar de server
      io.to(room).emit("receive-message", messageObject); 
    } else {
      socket.emit("error", "Room not found");
    }
  });

  // gebruiker sluit af
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

// confirmatie dat de server geen problemen geeft
server.listen(8080, () => {
  console.log("Server is running on port 8080");
});
