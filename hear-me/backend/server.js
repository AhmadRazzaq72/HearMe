const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("call-user", ({ userToCall, signalData, from }) => {
    io.to(userToCall).emit("incoming-call", { signal: signalData, from });
  });

  socket.on("answer-call", ({ to, signal }) => {
    io.to(to).emit("call-accepted", signal);
  });

  socket.on("join", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    console.log("User joined:", userId);
  });
});

server.listen(5000, () => console.log("Signaling server running on port 5000"));
