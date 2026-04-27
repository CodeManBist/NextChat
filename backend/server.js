import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import Message from "./models/message.model.js";

import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

// Config
dotenv.config();

// App & Server
const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Database
connectDB();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Socket Logic 
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Identify user
  socket.on("identifyUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  // Send message
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      if (!senderId || !receiverId || !text) return;

      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
      });

      const receiverSocketId = onlineUsers.get(receiverId);

      // Send to receiver
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage);
      }

      // Send back to sender
      socket.emit("receiveMessage", newMessage);

    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    }
  });
});

// Default Route
app.get("/", (req, res) => {
  res.send("API running...");
});

// Start Server
const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});