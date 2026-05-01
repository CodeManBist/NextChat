import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import Message from "./models/message.model.js";

import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

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
app.use("/uploads", express.static("uploads"));
app.use("/api/upload", uploadRoutes);

// Socket Logic 
// userId -> Set<socketId> to support multiple tabs/devices per user
const onlineUsers = new Map();

const emitOnlineUsers = () => {
  io.emit("onlineUsers", Array.from(onlineUsers.keys()));
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Identify user
  socket.on("identifyUser", (userId) => {
    if (!userId) return;

    socket.userId = userId;
    const existingSockets = onlineUsers.get(userId) || new Set();
    existingSockets.add(socket.id);
    onlineUsers.set(userId, existingSockets);

    emitOnlineUsers();
  });

  // typing indicators
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSockets = onlineUsers.get(receiverId);
    if (!receiverSockets) return;

    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("typing", { senderId, receiverId });
    });
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSockets = onlineUsers.get(receiverId);
    if (!receiverSockets) return;

    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("stopTyping", { senderId, receiverId });
    });
  });

  // Send message
  socket.on("sendMessage", async ({ senderId, receiverId, text, fileUrl, fileType }) => {
    try {
      if (!senderId || !receiverId || (!text && !fileUrl)) return;

      const newMessage = await Message.create({
        senderId,
        receiverId,
        text: text || "",
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        seen: false,
      });

      const receiverSocketIds = onlineUsers.get(receiverId);

      // Send to all receiver sockets
      if (receiverSocketIds && receiverSocketIds.size > 0) {
        receiverSocketIds.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit("receiveMessage", newMessage);
        });
      }

      // Send back to sender
      socket.emit("receiveMessage", newMessage);

    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("markMessagesSeen", async ({ senderId, receiverId }) => {
    try {
      if (!senderId || !receiverId) return;

      const unseenMessages = await Message.find({
        senderId,
        receiverId,
        seen: false,
      }).select("_id");

      const result = await Message.updateMany(
        {
          senderId,
          receiverId,
          seen: false,
        },
        {
          $set: {
            seen: true,
            seenAt: new Date(),
          },
        }
      );

      if (result.modifiedCount > 0 && unseenMessages.length > 0) {
        const senderSockets = onlineUsers.get(senderId);
        const seenMessageIds = unseenMessages.map((message) => message._id.toString());

        if (senderSockets && senderSockets.size > 0) {
          senderSockets.forEach((senderSocketId) => {
            io.to(senderSocketId).emit("messagesSeen", {
              seenBy: receiverId,
              senderId,
              messageIds: seenMessageIds,
            });
          });
        }
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (socket.userId) {
      const userSockets = onlineUsers.get(socket.userId);

      if (userSockets) {
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(socket.userId);
        } else {
          onlineUsers.set(socket.userId, userSockets);
        }

        emitOnlineUsers();
      }
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