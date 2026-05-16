const USER_ROOM_PREFIX = "user:";

const getUserRoom = (userId) => `${USER_ROOM_PREFIX}${userId}`;

const emitOnlineUsers = async (io) => {
  try {
    const sockets = await io.fetchSockets();
    const users = [...new Set(sockets.map((socket) => socket.data.userId).filter(Boolean).map(String))];
    io.emit("onlineUsers", users);
  } catch (err) {
    console.error("Failed to emit online users", err);
  }
};

export const setupPresenceHandlers = (io, socket) => {
  const authenticatedUserId = socket.data.userId;

  if (!authenticatedUserId) {
    socket.disconnect(true);
    return;
  }

  socket.join(getUserRoom(authenticatedUserId));

  (async () => {
    await emitOnlineUsers(io);
    console.log(`✅ User ${authenticatedUserId} connected (socket: ${socket.id})`);
  })().catch((err) => {
    console.error("Error tracking user connection", err);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    (async () => {
      try {
        await emitOnlineUsers(io);
        console.log(`📵 User ${authenticatedUserId} is now offline`);
      } catch (err) {
        console.error("Error handling disconnect", err);
      }
    })();
  });
};

// Export helper to get user's sockets
export const getUserSockets = async (io, userId) => {
  try {
    if (!io || !userId) return [];

    const sockets = await io.in(getUserRoom(userId)).fetchSockets();
    return sockets.map((socket) => socket.id);
  } catch (err) {
    console.error("Error getting user sockets", err);
    return null;
  }
};

// Export all online users
export const getOnlineUsers = async (io) => {
  try {
    if (!io) return [];

    const sockets = await io.fetchSockets();
    return [...new Set(sockets.map((socket) => socket.data.userId).filter(Boolean).map(String))];
  } catch (err) {
    console.error("Error getting online users", err);
    return [];
  }
};
