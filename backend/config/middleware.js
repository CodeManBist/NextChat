import cors from "cors";
import express from "express";

/**
 * Setup all Express middlewares
 * @param {Express.Application} app - Express app instance
 */
export const setupMiddlewares = (app) => {
  // CORS middleware
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    })
  );

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static files
  app.use("/uploads", express.static("uploads"));
};
