// socket.ts
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000");

export const joinSocket = (userId: string) => {
  socket.emit("join", userId);
};
