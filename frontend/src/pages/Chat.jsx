import React, { useState, useEffect, useRef, useContext } from "react";
import AppLayout from "../components/layout/AppLayout";
import ChatHeaderUnified from "../components/ChatHeaderUnified";
import socket from "../socket";
import ChatUI from "../components/ChatUI";
import GroupChat from "../components/groups/GroupChat";
import { GroupContext } from "../context/GroupContext";
import useTypingIndicator from "../hooks/useTypingIndicator";
import { FiMessageCircle, FiSettings, FiUsers } from "react-icons/fi";
import { MdOutlineRadioButtonChecked } from "react-icons/md";

const Chat = () => {
  const chatContainerRef = useRef(null);
  const previousScrollHeightRef = useRef(0);
  const pendingScrollBehaviorRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const currentUserId = localStorage.getItem("userId");
  const currentUsername = localStorage.getItem("username");
  const { setCurrentGroup } = useContext(GroupContext);

  // Typing indicator with debouncing for 1-on-1 chats
  const { handleTyping } = useTypingIndicator(
    () => {
      if (selectedUser && !selectedUser.isGroup) {
        socket.emit("typing", { senderId: currentUserId, receiverId: selectedUser._id });
      }
    },
    () => {
      if (selectedUser && !selectedUser.isGroup) {
        socket.emit("stopTyping", { senderId: currentUserId, receiverId: selectedUser._id });
      }
    }
  );

  // Clear currentGroup when switching away from group chat
  useEffect(() => {
    if (selectedUser?.isGroup) {
      // Group will set currentGroup via GroupsSection
      // This just ensures it's set if coming back to selected group
      setCurrentGroup(selectedUser);
    } else {
      // Clear currentGroup for individual chats
      setCurrentGroup(null);
    }
  }, [selectedUser?.isGroup, selectedUser?._id]);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  };

  const handleScroll = () => {
    if (!chatContainerRef.current || isLoadingMore || !hasMore || !selectedUser) return;

    // reached top
    if (chatContainerRef.current.scrollTop <= 10) {
      const nextPage = page + 1;
      fetchMessages(selectedUser._id, nextPage);
    }
  };

  // ================= FETCH MESSAGES =================
  const fetchMessages = async (userId, pageNumber = 1) => {
    if (isLoadingMore || !userId) return;

    if (pageNumber > 1 && !hasMore) return;

    const container = chatContainerRef.current;

    if (pageNumber === 1) {
      pendingScrollBehaviorRef.current = "bottom";
    } else if (container) {
      previousScrollHeightRef.current = container.scrollHeight;
      pendingScrollBehaviorRef.current = "preserve";
    }

    try {
      setIsLoadingMore(true);

      const response = await fetch(
        `http://localhost:5000/api/messages/${currentUserId}/${userId}?page=${pageNumber}&limit=20`
      );

      const data = await response.json();

        // Ensure messages are ordered oldest -> newest for display
        const ordered = Array.isArray(data) ? data : [];
        setMessages((prev) =>
          pageNumber === 1 ? ordered : [...ordered, ...prev]
        );
        // If loading first page, ensure we scroll to bottom to show most recent messages
        if (pageNumber === 1) {
          requestAnimationFrame(() => {
            const container = chatContainerRef.current;
            if (container) {
              // small timeout to allow layout (images/etc.) to settle
              setTimeout(() => {
                container.scrollTop = container.scrollHeight;
              }, 80);
            }
          });
        }
      setPage(pageNumber);

      if (data.length < 20) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    console.log("🚀 sendMessage called with:", newMessage.trim());

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
    scrollToBottom();
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

  // ================= SOCKET SETUP =================
  useEffect(() => {
    if(Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    if (!currentUserId) return;

    // Listen for online users
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {

      
      // Check if message is from the selected user (active chat)
      const isActiveChat = 
        message.senderId === selectedUser?._id;

      // Only show notification if app is hidden OR not viewing this conversation
      if(
        message.receiverId === currentUserId &&
        (document.visibilityState === "hidden" || !isActiveChat)
      ) {
        new Notification("New Message", {
          body: 
            message.text ||
            "Sent an attachment",

          icon: "/logo.png"
        });
      }

      // Only update if message belongs to current chat
      if (
        message.senderId === selectedUser?._id ||
        message.receiverId === selectedUser?._id
      ) {
        setMessages((prev) => {
          const isDuplicate = message._id && prev.some((msg) => msg._id === message._id);
          if (isDuplicate) {
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

        scrollToBottom();
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
      socket.off("onlineUsers");
      socket.off("receiveMessage");
      socket.off("messagesSeen");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [selectedUser?._id, currentUserId]);

  // ================= LOAD CHAT WHEN USER SELECTED =================
  useEffect(() => {
    if (selectedUser) {
      setPage(1);
      setHasMore(true);
      setMessages([]);
      fetchMessages(selectedUser._id, 1);
    } else {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      pendingScrollBehaviorRef.current = null;
      previousScrollHeightRef.current = 0;
    }
  }, [selectedUser]);

  useEffect(() => {
    const container = chatContainerRef.current;

    if (!container) return;

    if (pendingScrollBehaviorRef.current === "bottom" && messages.length > 0) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
        pendingScrollBehaviorRef.current = null;
      });
      return;
    }

    if (
      pendingScrollBehaviorRef.current === "preserve" &&
      previousScrollHeightRef.current > 0 &&
      !isLoadingMore
    ) {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - previousScrollHeightRef.current;
      pendingScrollBehaviorRef.current = null;
      previousScrollHeightRef.current = 0;
    }
  }, [messages, isLoadingMore, selectedUser]);

  useEffect(() => {
    markConversationSeen();
  }, [messages, selectedUser, currentUserId]);

  const isChatsMenuActive = activeMenu === "chats" || activeMenu === "groups";
  const panelMessages = {
    chats: "Select a user to start chatting.",
    status: "Status section selected. Add status updates here.",
    groups: "Create or join groups to chat with multiple members.",
    settings: "Settings section selected. Manage preferences here.",
    default: "Select a section from the sidebar to continue.",
  };

  const panelVisuals = {
    chats: {
      icon: FiMessageCircle,
      title: "Chats",
      helper: "Your recent contacts are listed on the left.",
    },
    status: {
      icon: MdOutlineRadioButtonChecked,
      title: "Status",
      helper: "Share quick updates and view status activity.",
    },
    groups: {
      icon: FiUsers,
      title: "Groups",
      helper: "Create or join groups to chat with multiple members.",
    },
    settings: {
      icon: FiSettings,
      title: "Settings",
      helper: "Manage theme, privacy, and chat preferences.",
    },
    default: {
      icon: FiMessageCircle,
      title: "NextChat",
      helper: "Use the left panel to continue.",
    },
  };

  const currentPanelMessage =
    panelMessages[activeMenu] || panelMessages.default;
  const currentPanelVisual =
    panelVisuals[activeMenu] || panelVisuals.default;
  const PanelIcon = currentPanelVisual.icon;

  const showChatsPrompt = isChatsMenuActive && !selectedUser;

  const EmptyStatePanel = ({ message }) => (
    <div className="h-full w-full relative overflow-hidden bg-[#07111B] flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-[#1A3A5C] bg-[#0F1E35]/75 backdrop-blur-md p-6 sm:p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-[#1A3A5C]/70 border border-[#2A517F] flex items-center justify-center">
          <PanelIcon className="h-7 w-7 text-blue-300" />
        </div>
        <p className="text-blue-300 text-sm font-semibold tracking-wide uppercase mb-2">
          {currentPanelVisual.title}
        </p>
        <p className="text-base sm:text-lg text-[#B7C8D9] font-medium">
          {message}
        </p>
        <p className="mt-2 text-sm text-[#8EA7A3]">
          {showChatsPrompt
            ? panelVisuals.chats.helper
            : currentPanelVisual.helper}
        </p>
      </div>
    </div>
  );

  return (
    <AppLayout
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
    >
      {!isChatsMenuActive ? (
        <EmptyStatePanel message={currentPanelMessage} />
      ) : !selectedUser ? (
        <EmptyStatePanel message={currentPanelMessage} />
      ) : selectedUser?.isGroup ? (
        // Group Chat View
        <GroupChat onBack={() => setSelectedUser(null)} />
      ) : (
        // Individual Chat View
        <div className="h-full w-full flex flex-col overflow-hidden">
          {/* Unified Chat Header - Works for both 1-on-1 and groups */}
          <ChatHeaderUnified
            selectedUser={selectedUser}
            isGroup={false}
            onBack={() => setSelectedUser(null)}
            currentUsername={currentUsername}
            isTyping={isTyping}
            onlineUsers={onlineUsers}
          />

          {/* Chat Messages Area */}
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
            chatContainerRef={chatContainerRef}
            handleScroll={handleScroll}
          />
        </div>
      )}
    </AppLayout>
  );
};

export default Chat;