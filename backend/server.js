import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";

import connectDB from "./config/db.js";
import { createSocketServer } from "./config/socket.js";
import { setupMiddlewares } from "./config/middleware.js";
import { setupRoutes } from "./config/routes.js";
import { initializeSocketHandlers } from "./sockets/index.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = createSocketServer(httpServer);

// Setup database connection
connectDB();

// Setup middlewares
setupMiddlewares(app);

// Setup routes
setupRoutes(app);

// Setup Socket.IO event handlers
initializeSocketHandlers(io);

// Start server
const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🔌 WebSocket ready for connections`);
});