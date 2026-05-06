import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const createSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // Socket.IO Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded?.id;

      if (!userId) {
        return next(new Error("Authentication error"));
      }

      socket.data.userId = userId.toString();
      return next();
    } catch (error) {
      return next(new Error("Authentication error"));
    }
  });

  return io;
};
