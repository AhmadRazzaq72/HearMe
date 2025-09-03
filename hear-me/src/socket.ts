import { io, Socket } from "socket.io-client";

// use .env value or fallback to localhost
// http://localhost:5000
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

export function joinSocket(userId: string) {
  socket.emit("join", { userId });
}
