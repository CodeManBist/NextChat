import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import connectDB from "./config/db.js";

import Message from "./models/message.model.js";
import User from "./models/user.model.js";

import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import groupRoutes from "./routes/group.routes.js";
import Group from "./models/group.model.js";

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
app.use("/api/groups", groupRoutes);
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
  const authenticatedUserId = socket.data.userId;

  if (!authenticatedUserId) {
    socket.disconnect(true);
    return;
  }

  const existingSockets = onlineUsers.get(authenticatedUserId) || new Set();
  existingSockets.add(socket.id);
  onlineUsers.set(authenticatedUserId, existingSockets);
  emitOnlineUsers();

  // typing indicators
  socket.on("typing", ({ receiverId }) => {
    const senderId = socket.data.userId;

    if (!senderId || !receiverId) return;

    const receiverSockets = onlineUsers.get(receiverId);
    if (!receiverSockets) return;

    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("typing", { senderId, receiverId });
    });
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const senderId = socket.data.userId;

    if (!senderId || !receiverId) return;

    const receiverSockets = onlineUsers.get(receiverId);
    if (!receiverSockets) return;

    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("stopTyping", { senderId, receiverId });
    });
  });

  //users join their group rooms for group chats
  socket.on("joinGroups", async (groupIds) => {
    try {
      if (!Array.isArray(groupIds) || groupIds.length === 0) return;

      for (const groupId of groupIds) {
        // Verify user is member of group
        const group = await Group.findById(groupId);
        if (group && group.members.includes(authenticatedUserId)) {
          socket.join(groupId);
        }
      }
    } catch (error) {
      console.error("Error joining groups:", error);
    }
  });

  // Group typing indicators
  socket.on("groupTyping", async ({ groupId, receiverId }) => {
    const senderId = socket.data.userId;

    if (!senderId || !groupId) return;

    const sender = await User.findById(senderId).select("username");

    io.to(groupId).emit("groupTyping", {
      senderId,
      senderName: sender?.username || "Someone",
      groupId,
    });
  });

  socket.on("groupStopTyping", async ({ groupId }) => {
    const senderId = socket.data.userId;

    if (!senderId || !groupId) return;

    const sender = await User.findById(senderId).select("username");

    io.to(groupId).emit("groupStopTyping", {
      senderId,
      senderName: sender?.username || "Someone",
      groupId,
    });
  });

  //send group message
  socket.on("sendGroupMessage", async ({ groupId, text, fileUrl, fileType }) => {
    try {
      const senderId = socket.data.userId;

      if(!senderId || !groupId || (!text && !fileUrl)) return;

      console.log("📨 Backend received sendGroupMessage:", { groupId, senderId, text: text?.substring(0, 30) });

      // Verify user is member of group
      const group = await Group.findById(groupId);
      if (!group || !group.members.includes(senderId)) {
        socket.emit("error", { message: "Not authorized to send message to this group" });
        return;
      }

      const newMessage = await Message.create({
        senderId,
        groupId,
        text: text || "",
        fileUrl: fileUrl || null,
        fileType: fileType || null,
      });

      console.log("✅ Group message saved to DB:", newMessage._id);

      // Populate sender details
      const populatedMessage = await newMessage.populate("senderId", "username avatar email");

      console.log("📤 Sending to other group members");
      // Send to other members in group (not sender)
      socket.broadcast.to(groupId).emit("receiveGroupMessage", populatedMessage);
      
      console.log("📤 Sending back to sender (group)");
      // Send to sender separately (optimistic update confirmation)
      socket.emit("receiveGroupMessage", populatedMessage);

    } catch (error) {
      console.error("Error saving group message:", error);
    }
  });

  // Send message to individual user
  socket.on("sendMessage", async ({ receiverId, text, fileUrl, fileType }) => {
    try {
      const senderId = socket.data.userId;

      if (!senderId || !receiverId || (!text && !fileUrl)) return;

      console.log("📨 Backend received sendMessage:", { senderId, receiverId, text: text?.substring(0, 30) });

      const newMessage = await Message.create({
        senderId,
        receiverId,
        text: text || "",
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        seen: false,
      });

      console.log("✅ Message saved to DB:", newMessage._id);

      const receiverSocketIds = onlineUsers.get(receiverId);

      // Send to all receiver sockets
      if (receiverSocketIds && receiverSocketIds.size > 0) {
        console.log("📤 Sending to receiver, socket count:", receiverSocketIds.size);
        receiverSocketIds.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit("receiveMessage", newMessage);
        });
      }

      // Send back to sender
      console.log("📤 Sending back to sender (socket)");
      socket.emit("receiveMessage", newMessage);

    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("markMessagesSeen", async ({ senderId }) => {
    try {
      const receiverId = socket.data.userId;

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

    if (authenticatedUserId) {
      const userSockets = onlineUsers.get(authenticatedUserId);

      if (userSockets) {
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(authenticatedUserId);
        } else {
          onlineUsers.set(authenticatedUserId, userSockets);
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