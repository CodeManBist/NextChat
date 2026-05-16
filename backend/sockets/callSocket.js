import { getUserSockets } from "./presense.socket.js";
import redisClient from "../config/redis.js";

export const setupCallHandlers = (io, socket) => {
  const userId = socket.data.userId;

  if (!userId) {
    socket.disconnect(true);
    return;
  }

  // Optional: join a named call room
  socket.on("join-room", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
  });

  // Offer (incoming call)
  socket.on("offer", async ({ to, offer, callId } = {}) => {
    try {
      if (!to || !offer) return;

      // Check if caller is already in a call
      const existingCallerCall = await redisClient.get(`active_call:${userId}`);
      if (existingCallerCall) {
        const callerSockets = await getUserSockets(io, userId);
        (callerSockets || []).forEach((sid) => {
          io.to(sid).emit("user-busy", { reason: "caller-in-call", callId: existingCallerCall });
        });
        return;
      }

      // Check if callee is already in a call
      const existing = await redisClient.get(`active_call:${to}`);
      if (existing) {
        const callerSockets = await getUserSockets(io, userId);
        (callerSockets || []).forEach((sid) => {
          io.to(sid).emit("user-busy", { reason: "callee-busy", callId: existing });
        });
        return;
      }

      const targets = await getUserSockets(io, to);
      if (!targets || targets.length === 0) return;
      targets.forEach((socketId) => {
        io.to(socketId).emit("incoming-call", { from: userId, callId, offer });
      });
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  });

  // Answer
  socket.on("answer-call", async ({ to, answer, callId } = {}) => {
    try {
      if (!to || !answer) return;
      // Mark both users as in-call
      if (callId) {
        try {
          await redisClient.set(`active_call:${userId}`, callId);
          await redisClient.set(`active_call:${to}`, callId);
        } catch (e) {
          console.error('Failed to mark active call in Redis', e);
        }
      }
      const targets = await getUserSockets(io, to);
      if (!targets || targets.length === 0) return;
      targets.forEach((socketId) => {
        io.to(socketId).emit("call-answered", { from: userId, callId, answer });
      });
    } catch (err) {
      console.error("Error handling answer-call:", err);
    }
  });

  // ICE candidates
  socket.on("ice-candidate", async ({ to, candidate, callId } = {}) => {
    try {
      if (!to || !candidate) return;
      const targets = await getUserSockets(io, to);
      if (!targets || targets.length === 0) return;
      targets.forEach((socketId) => {
        io.to(socketId).emit("ice-candidate", { from: userId, callId, candidate });
      });
    } catch (err) {
      console.error("Error forwarding ICE candidate:", err);
    }
  });

  // End call
  socket.on("end-call", async ({ to, callId } = {}) => {
    try {
      if (!to) return;
      const targets = await getUserSockets(io, to);
      if (!targets || targets.length === 0) return;
      targets.forEach((socketId) => {
        io.to(socketId).emit("call-ended", { from: userId, callId });
      });

      // Clear active call state for both participants
      try {
        await redisClient.del(`active_call:${userId}`);
        await redisClient.del(`active_call:${to}`);
      } catch (e) {
        console.error('Failed to clear active call state in Redis', e);
      }
    } catch (err) {
      console.error("Error handling end-call:", err);
    }
  });

  // Clean up on disconnect if needed later
  socket.on("disconnect", () => {
    // TODO: notify active call participants if required
  });
};

export default setupCallHandlers;
