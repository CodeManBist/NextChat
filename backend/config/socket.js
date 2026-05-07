import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createAdapter } from "@socket.io/redis-adapter";
import redisClient from "./redis.js";

export const createSocketServer = async (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // If REDIS_URL is set, wire up the Redis adapter for cross-process pub/sub
  if (process.env.REDIS_URL) {
    try {
      const subClient = redisClient.duplicate();
      await subClient.connect();
      io.adapter(createAdapter(redisClient, subClient));
      console.log("✅ Socket.IO Redis adapter configured");
    } catch (err) {
      console.error("Failed to configure Redis adapter", err);
    }
  }

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
