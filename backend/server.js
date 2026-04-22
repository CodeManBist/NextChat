import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    },
 });

connectDB();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api/users", userRoutes);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello World!");
})

//when a client connects to the server via Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Received message:", data);

    //send message to all clients
    io.emit("receiveMessage", data);
})

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

