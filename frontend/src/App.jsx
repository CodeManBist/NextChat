import React, { useEffect } from 'react';
import socket from "./socket";

function App() {

  const user = { _id: "user1" };

  useEffect(() => {
  const handleConnect = () => {
    console.log("Connected:", socket.id);
    socket.emit("identifyUser", user._id);
    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId: "user2",
      text: "Hello from React",
    });
  };

  const handleReceive = (data) => {
    console.log("Received:", data);
  };

  socket.on("connect", handleConnect);
  socket.on("receiveMessage", handleReceive);

  return () => {
    socket.off("connect", handleConnect);
    socket.off("receiveMessage", handleReceive);
  };
}, []);
  
  return (
    <h1>Socket Test</h1>
  );
}

export default App
