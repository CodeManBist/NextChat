import { setupPresenceHandlers } from "./presense.socket.js";
import { setupChatHandlers } from "./chat.socket.js";
import { setupGroupHandlers } from "./group.socket.js";

/**
 * Initialize all Socket.IO event handlers
 * @param {Server} io - Socket.IO server instance
 */
export const initializeSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 New connection established:", socket.id);

    // Setup all event handlers for this socket
    setupPresenceHandlers(io, socket);
    setupChatHandlers(io, socket);
    setupGroupHandlers(io, socket);
  });
};

export { setupPresenceHandlers, setupChatHandlers, setupGroupHandlers };
