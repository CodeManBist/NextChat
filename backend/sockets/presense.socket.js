// Manage online users and their socket connections
// userId -> Set<socketId> to support multiple tabs/devices per user
const onlineUsers = new Map();

const emitOnlineUsers = (io) => {
  io.emit("onlineUsers", Array.from(onlineUsers.keys()));
};

export const setupPresenceHandlers = (io, socket) => {
  const authenticatedUserId = socket.data.userId;

  if (!authenticatedUserId) {
    socket.disconnect(true);
    return;
  }

  // Track user connection
  const existingSockets = onlineUsers.get(authenticatedUserId) || new Set();
  existingSockets.add(socket.id);
  onlineUsers.set(authenticatedUserId, existingSockets);
  emitOnlineUsers(io);

  console.log(`✅ User ${authenticatedUserId} connected (socket: ${socket.id})`);

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);

    if (authenticatedUserId) {
      const userSockets = onlineUsers.get(authenticatedUserId);

      if (userSockets) {
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(authenticatedUserId);
          console.log(`📵 User ${authenticatedUserId} is now offline`);
        } else {
          onlineUsers.set(authenticatedUserId, userSockets);
        }

        emitOnlineUsers(io);
      }
    }
  });
};

// Export helper to get user's sockets
export const getUserSockets = (userId) => {
  return onlineUsers.get(userId);
};

// Export all online users
export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};
