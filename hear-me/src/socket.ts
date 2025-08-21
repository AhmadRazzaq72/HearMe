// src/socket.ts
import { io } from "socket.io-client";

// Create a single socket instance
export const socket = io("http://localhost:5000");

// Function to join with a unique ID
export const joinSocket = (userId: string) => {
  socket.emit("join", userId);
};
