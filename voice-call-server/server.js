const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const users = {}; // Map userId -> socketId

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Save userId and socket mapping
  socket.on("join", (userId) => {
  users[userId] = socket.id;
  socket.userId = userId;
  console.log("📌 Current users:", users);
});

  // Caller sends offer
  socket.on("call-user", ({ userToCall, signalData, from }) => {
    console.log(`call-user: ${from} -> ${userToCall}`);
    if (users[userToCall]) {
      io.to(users[userToCall]).emit("incoming-call", { signal: signalData, from });
    }
  });

  // Callee sends answer
  socket.on("answer-call", ({ to, signal }) => {
    console.log(`answer-call: ${socket.userId} -> ${to}`);
    if (users[to]) {
      io.to(users[to]).emit("call-accepted", signal);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`);
    if (socket.userId) {
      delete users[socket.userId];
    }
  });
});

server.listen(5000, () =>
  console.log("Signaling server running on port 5000")
);
