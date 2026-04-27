import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

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
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* ================= LEFT SIDEBAR ================= */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}>
        
        <h2>I am {currentUsername}</h2>

        <h2>Users</h2>

        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            style={{
              padding: "10px",
              cursor: "pointer",
              background:
                selectedUser?._id === user._id ? "#eee" : "transparent",
            }}
          >
            {user.username}
          </div>
        ))}
      </div>

      {/* ================= CHAT AREA ================= */}
      <div style={{ width: "70%", padding: "10px" }}>
        {selectedUser ? (
          <>
            <h2>Chat with {selectedUser.username}</h2>

            {/* Messages */}
            <div style={{ height: "70vh", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
              {messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  style={{
                    textAlign:
                      msg.senderId === currentUserId ? "right" : "left",
                    margin: "5px 0",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      background:
                        msg.senderId === currentUserId
                          ? "#4caf50"
                          : "#ddd",
                      color:
                        msg.senderId === currentUserId ? "#fff" : "#000",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ marginTop: "10px", display: "flex" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, padding: "10px" }}
              />
              <button onClick={sendMessage} style={{ padding: "10px" }}>
                Send
              </button>
            </div>
          </>
        ) : (
          <h2>Select a user to start chatting</h2>
        )}
      </div>
    </div>
  );
};

export default Chat;