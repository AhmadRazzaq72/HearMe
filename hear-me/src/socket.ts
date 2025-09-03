// src/socket.ts
import { io, Socket } from "socket.io-client";

// 👇 replace localhost with your ngrok https URL
export const socket: Socket = io(
  "https://ccaa326f32d0.ngrok-free.app", 
  { transports: ["websocket"] }
);

export function joinSocket(userId: string) {
  socket.emit("join", { userId });
}
