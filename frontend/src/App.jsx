import React, { useEffect } from 'react';
import socket from "./socket";

function App() {

  useEffect(() => {
    socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  // Receive message
  socket.on("receiveMessage", (data) => {
    console.log("Received:", data);
  });

  // Send test message
  socket.emit("sendMessage", {
    text: "Hello from React",
  });

  return () => {
    socket.off("connect");
    socket.off("receiveMessage");
  };
}, []);
  
  return (
    <h1>Socket Test</h1>
  );
}

export default App
