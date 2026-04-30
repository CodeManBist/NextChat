import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import socket from "../socket";
import ChatUI from "../components/ChatUI";

const Chat = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const currentUserId = localStorage.getItem("userId");
  const currentUsername = localStorage.getItem("username");

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
    socket.emit("stopTyping", {
      senderId: currentUserId,
      receiverId: selectedUser._id,
    });

    setNewMessage("");
  };

  const markConversationSeen = (activeMessages = messages) => {
    if (!selectedUser || !currentUserId) return;

    const hasUnseenIncoming = activeMessages.some(
      (msg) =>
        msg.senderId === selectedUser._id &&
        msg.receiverId === currentUserId &&
        !msg.seen
    );

    if (!hasUnseenIncoming) return;

    socket.emit("markMessagesSeen", {
      senderId: selectedUser._id,
      receiverId: currentUserId,
    });

    setMessages((prev) =>
      prev.map((msg) =>
        msg.senderId === selectedUser._id &&
        msg.receiverId === currentUserId &&
        !msg.seen
          ? { ...msg, seen: true, seenAt: new Date().toISOString() }
          : msg
      )
    );
  };

  const handleTyping = (text) => {
    if (!selectedUser) return;

    if (text.trim()) {
      socket.emit("typing", {
        senderId: currentUserId,
        receiverId: selectedUser._id,
      });
    } else {
      socket.emit("stopTyping", {
        senderId: currentUserId,
        receiverId: selectedUser._id,
      });
    }
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
          const nextMessages = [...prev, message];

          if (
            message.senderId === selectedUser?._id &&
            message.receiverId === currentUserId
          ) {
            socket.emit("markMessagesSeen", {
              senderId: selectedUser._id,
              receiverId: currentUserId,
            });

            return nextMessages.map((msg) =>
              msg._id === message._id ? { ...msg, seen: true } : msg
            );
          }

          return nextMessages;
        });
      }
    });

    socket.on("messagesSeen", ({ seenBy, senderId, messageIds = [] }) => {
      if (seenBy !== selectedUser?._id && senderId !== currentUserId) return;

      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id)
            ? { ...msg, seen: true, seenAt: new Date().toISOString() }
            : msg.senderId === currentUserId && msg.receiverId === seenBy
            ? { ...msg, seen: true, seenAt: new Date().toISOString() }
            : msg
        )
      );
    });

    socket.on("typing", ({ senderId, receiverId }) => {
      if (senderId === selectedUser?._id && receiverId === currentUserId) {
        setIsTyping(true);
      }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      if (senderId === selectedUser?._id && receiverId === currentUserId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messagesSeen");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [selectedUser, currentUserId]);

  // ================= LOAD CHAT WHEN USER SELECTED =================
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  useEffect(() => {
    markConversationSeen();
  }, [messages, selectedUser, currentUserId]);

  const isChatsMenuActive = activeMenu === "chats";

  return (
    <AppLayout
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
    >
      {!isChatsMenuActive ? (
        <div className="h-full w-full flex items-center justify-center text-[#8EA7A3] text-center px-6">
          Select <span className="mx-1 text-green-400 font-semibold">Chats</span> from the left sidebar to start.
        </div>
      ) : !selectedUser ? (
        <div className="h-full w-full flex items-center justify-center text-[#8EA7A3] text-center px-6">
          Select a user from the left sidebar to start chatting.
        </div>
      ) : (
        <ChatUI
          selectedUser={selectedUser}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          handleTyping={handleTyping}
          currentUserId={currentUserId}
          currentUsername={currentUsername}
          isEmpty={messages.length === 0}
          isTyping={isTyping}
        />
      )}
    </AppLayout>
  );
};

export default Chat;