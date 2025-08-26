// src/socket.ts
import { io, Socket } from "socket.io-client";

// 👇 replace localhost with your ngrok https URL
export const socket: Socket = io(
  "https://9420c0b6c16c.ngrok-free.app", 
  { transports: ["websocket"] }
);

export function joinSocket(userId: string) {
  socket.emit("join", { userId });
}
