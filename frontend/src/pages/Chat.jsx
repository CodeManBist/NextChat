import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import socket from "../socket";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const currentUserId = localStorage.getItem("userId");
  const currentUsername = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // ================= FETCH MESSAGES =================
  const fetchMessages = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${currentUserId}/${userId}`
      );

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      text: newMessage,
    };

    // Emit to socket
    socket.emit("sendMessage", messageData);

    setNewMessage("");
  };

  // ================= SOCKET SETUP =================
  useEffect(() => {
    if (!currentUserId) return;

    // Identify user
    socket.emit("identifyUser", currentUserId);

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      // Only update if message belongs to current chat
      if (
        message.senderId === selectedUser?._id ||
        message.receiverId === selectedUser?._id
      ) {
        setMessages((prev) => {
          if (message._id && prev.some((msg) => msg._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser, currentUserId]);

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= LOAD CHAT WHEN USER SELECTED =================
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  return (
    <AppLayout>
      
    </AppLayout>
  );
};

export default Chat;