import Message from "../models/message.model.js";
import { getUserSockets } from "./presense.socket.js";

export const setupChatHandlers = (io, socket) => {
  const senderId = socket.data.userId;

  // Typing indicator
  socket.on("typing", ({ receiverId }) => {
    if (!senderId || !receiverId) return;

    const receiverSockets = getUserSockets(receiverId);
    if (!receiverSockets) return;

    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("typing", { senderId, receiverId });
    });
  });

  // Stop typing indicator
  socket.on("stopTyping", ({ receiverId }) => {
    if (!senderId || !receiverId) return;

    const receiverSockets = getUserSockets(receiverId);
    if (!receiverSockets) return;

    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("stopTyping", { senderId, receiverId });
    });
  });

  // Send direct message
  socket.on("sendMessage", async ({ receiverId, text, fileUrl, fileType }) => {
    try {
      if (!senderId || !receiverId || (!text && !fileUrl)) return;

      console.log("📨 Message received:", { senderId, receiverId, text: text?.substring(0, 30) });

      const newMessage = await Message.create({
        senderId,
        receiverId,
        text: text || "",
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        seen: false,
      });

      console.log("✅ Message saved to DB:", newMessage._id);

      const receiverSocketIds = getUserSockets(receiverId);

      // Send to receiver
      if (receiverSocketIds && receiverSocketIds.size > 0) {
        console.log(`📤 Sending to receiver (${receiverSocketIds.size} devices)`);
        receiverSocketIds.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit("receiveMessage", newMessage);
        });
      }

      // Confirmation to sender
      console.log("📤 Sending confirmation to sender");
      socket.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("❌ Error saving message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Mark messages as seen
  socket.on("markMessagesSeen", async ({ senderId: messageFromSenderId }) => {
    try {
      const receiverId = socket.data.userId;

      if (!messageFromSenderId || !receiverId) return;

      const unseenMessages = await Message.find({
        senderId: messageFromSenderId,
        receiverId,
        seen: false,
      }).select("_id");

      const result = await Message.updateMany(
        {
          senderId: messageFromSenderId,
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
        const senderSockets = getUserSockets(messageFromSenderId);
        const seenMessageIds = unseenMessages.map((message) => message._id.toString());

        if (senderSockets && senderSockets.size > 0) {
          senderSockets.forEach((senderSocketId) => {
            io.to(senderSocketId).emit("messagesSeen", {
              seenBy: receiverId,
              senderId: messageFromSenderId,
              messageIds: seenMessageIds,
            });
          });
        }
      }
    } catch (error) {
      console.error("❌ Error marking messages as seen:", error);
    }
  });
};
