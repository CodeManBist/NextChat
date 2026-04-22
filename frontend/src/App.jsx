import React, { useEffect } from 'react';
import socket from "./socket";

function App() {

  useEffect(() => {
  const handleConnect = () => {
    console.log("Connected:", socket.id);
    socket.emit("sendMessage", {
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
