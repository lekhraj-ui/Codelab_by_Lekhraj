import { socket } from "../socket";

export const connectSocket = (userId: string) => {
  socket.connect();
  socket.emit("setUserId", userId);
  console.log("Socket connected for user:", userId);
};

export const disconnectSocket = () => {
  socket.disconnect();
  console.log("Socket disconnected");
};
