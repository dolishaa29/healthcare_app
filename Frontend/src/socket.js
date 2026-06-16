import { io } from "socket.io-client";

let socket = null;

export const getSocket = (token, role) => {
  if (socket && socket.connected) return socket;

  if (socket) socket.disconnect();

  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token, role },
    withCredentials: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
