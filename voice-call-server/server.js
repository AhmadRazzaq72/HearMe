import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // or restrict to your frontend's IP
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("join", ({ userId }) => {
    socket.data.userId = userId;
    console.log(`👤 ${userId} joined`);
  });

  socket.on("call-user", ({ userToCall, signalData, from }) => {
    const target = [...io.sockets.sockets.values()].find(
      (s) => s.data.userId === userToCall
    );
    if (target) {
      console.log(`📞 Call request from ${from} -> ${userToCall}`);
      target.emit("incoming-call", { from, signal: signalData });
    }
  });

  socket.on("answer-call", ({ to, signal }) => {
    const target = [...io.sockets.sockets.values()].find(
      (s) => s.data.userId === to
    );
    if (target) {
      console.log(`📞 Call Accepted`);
      target.emit("call-accepted", signal);
    }
  });

  socket.on("decline-call", ({ to }) => {
    const target = [...io.sockets.sockets.values()].find(
      (s) => s.data.userId === to
    );
    if (target) {
            console.log(`❌ Call Declined`);

      target.emit("call-declined");
    }
  });

  socket.on("end-call", ({ to }) => {
    const target = [...io.sockets.sockets.values()].find(
      (s) => s.data.userId === to
    );
    if (target) {
      target.emit("call-ended");
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${socket.data.userId || "Unknown"} disconnected`);
  });
});

// 👇 important: bind to 0.0.0.0 so it's visible on LAN
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Signaling server running at http://0.0.0.0:${PORT}`);
});
