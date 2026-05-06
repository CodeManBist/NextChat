import Group from "../models/group.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const setupGroupHandlers = (io, socket) => {
  const senderId = socket.data.userId;

  // Join group rooms
  socket.on("joinGroups", async (groupIds) => {
    try {
      if (!Array.isArray(groupIds) || groupIds.length === 0) return;

      for (const groupId of groupIds) {
        // Verify user is member of group
        const group = await Group.findById(groupId);
        if (group && group.members.includes(senderId)) {
          socket.join(groupId);
          console.log(`✅ User ${senderId} joined group ${groupId}`);
        }
      }
    } catch (error) {
      console.error("❌ Error joining groups:", error);
    }
  });

  // Group typing indicator
  socket.on("groupTyping", async ({ groupId, receiverId }) => {
    if (!senderId || !groupId) return;

    try {
      const sender = await User.findById(senderId).select("username");

      io.to(groupId).emit("groupTyping", {
        senderId,
        senderName: sender?.username || "Someone",
        groupId,
      });
    } catch (error) {
      console.error("❌ Error in groupTyping:", error);
    }
  });

  // Group stop typing indicator
  socket.on("groupStopTyping", async ({ groupId }) => {
    if (!senderId || !groupId) return;

    try {
      const sender = await User.findById(senderId).select("username");

      io.to(groupId).emit("groupStopTyping", {
        senderId,
        senderName: sender?.username || "Someone",
        groupId,
      });
    } catch (error) {
      console.error("❌ Error in groupStopTyping:", error);
    }
  });

  // Send group message
  socket.on("sendGroupMessage", async ({ groupId, text, fileUrl, fileType }) => {
    try {
      if (!senderId || !groupId || (!text && !fileUrl)) return;

      console.log("📨 Group message received:", { groupId, senderId, text: text?.substring(0, 30) });

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

      // Send to all group members
      console.log("📤 Broadcasting to group members");
      socket.broadcast.to(groupId).emit("receiveGroupMessage", populatedMessage);

      // Confirmation to sender
      socket.emit("receiveGroupMessage", populatedMessage);
    } catch (error) {
      console.error("❌ Error saving group message:", error);
      socket.emit("error", { message: "Failed to send group message" });
    }
  });
};
