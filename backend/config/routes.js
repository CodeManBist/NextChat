import userRoutes from "../routes/user.routes.js";
import messageRoutes from "../routes/message.routes.js";
import uploadRoutes from "../routes/upload.routes.js";
import groupRoutes from "../routes/group.routes.js";

/**
 * Setup all API routes
 * @param {Express.Application} app - Express app instance
 */
export const setupRoutes = (app) => {
  // API Routes
  app.use("/api/users", userRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/groups", groupRoutes);
  app.use("/api/upload", uploadRoutes);

  // Health check
  app.get("/", (req, res) => {
    res.json({ message: "✅ API running...", timestamp: new Date().toISOString() });
  });
};
