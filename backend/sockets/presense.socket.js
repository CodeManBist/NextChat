import redisClient from "../config/redis.js";

// Redis keys
const ONLINE_USERS_KEY = "online_users"; // set of userIds
const USER_SOCKETS_PREFIX = "user_sockets:"; // set of socketIds per user

const emitOnlineUsers = async (io) => {
  try {
    const users = await redisClient.sMembers(ONLINE_USERS_KEY);
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

  // Track user connection in Redis
  (async () => {
    try {
      await redisClient.sAdd(`${USER_SOCKETS_PREFIX}${authenticatedUserId}`, socket.id);
      await redisClient.sAdd(ONLINE_USERS_KEY, authenticatedUserId);
      await emitOnlineUsers(io);
      console.log(`✅ User ${authenticatedUserId} connected (socket: ${socket.id})`);
    } catch (err) {
      console.error("Error tracking user connection in Redis", err);
    }
  })();

  // Handle disconnect
  socket.on("disconnect", () => {
    (async () => {
      try {
        await redisClient.sRem(`${USER_SOCKETS_PREFIX}${authenticatedUserId}`, socket.id);

        // If no more sockets for this user, remove from online set
        const remaining = await redisClient.sCard(`${USER_SOCKETS_PREFIX}${authenticatedUserId}`);
        if (remaining === 0) {
          await redisClient.del(`${USER_SOCKETS_PREFIX}${authenticatedUserId}`);
          await redisClient.sRem(ONLINE_USERS_KEY, authenticatedUserId);
          console.log(`📵 User ${authenticatedUserId} is now offline`);
        }

        await emitOnlineUsers(io);
      } catch (err) {
        console.error("Error handling disconnect in Redis", err);
      }
    })();
  });
};

// Export helper to get user's sockets
export const getUserSockets = async (userId) => {
  try {
    const sockets = await redisClient.sMembers(`${USER_SOCKETS_PREFIX}${userId}`);
    return sockets;
  } catch (err) {
    console.error("Error getting user sockets from Redis", err);
    return null;
  }
};

// Export all online users
export const getOnlineUsers = async () => {
  try {
    return await redisClient.sMembers(ONLINE_USERS_KEY);
  } catch (err) {
    console.error("Error getting online users from Redis", err);
    return [];
  }
};
