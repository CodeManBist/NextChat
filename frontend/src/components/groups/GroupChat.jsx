import React, { useContext, useEffect, useRef, useState } from "react";
import { GroupContext } from "../../context/GroupContext";
import socket from "../../socket";
import useTypingIndicator from "../../hooks/useTypingIndicator";
import ChatHeaderUnified from "../ChatHeaderUnified";
import GroupMembers from "./GroupMembers";
import MessageBubble from "../ui/MessageBubble";
import ImagePreviewModal from "../ui/ImagePreviewModal";
import ChatInputArea from "../ui/ChatInputArea";

const GroupChat = ({ onBack }) => {
  const { currentGroup, groupMessages, setGroupMessages, fetchGroupMessages } = useContext(GroupContext);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const chatContainerRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");

  // Typing indicator with debouncing
  const { handleTyping } = useTypingIndicator(
    () => socket.emit("groupTyping", { groupId: currentGroup?._id }),
    () => socket.emit("groupStopTyping", { groupId: currentGroup?._id })
  );

  // Fetch group messages when group changes
  useEffect(() => {
    if (currentGroup) {
      fetchGroupMessages(currentGroup._id);
    }
  }, [currentGroup]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [groupMessages]);

  // Listen for group typing events only.
  // Group messages are handled centrally in GroupContext to avoid double-appending.
  useEffect(() => {
    const handleGroupTyping = ({ senderId, senderName }) => {
      if (senderId !== currentUserId) {
        setTypingUsers(prev => {
          if (prev.some((user) => user.senderId === senderId)) {
            return prev.map((user) =>
              user.senderId === senderId ? { ...user, senderName: senderName || user.senderName } : user
            );
          }

          return [...prev, { senderId, senderName: senderName || "Someone" }];
        });
      }
    };

    const handleGroupStopTyping = ({ senderId }) => {
      setTypingUsers(prev => prev.filter((user) => user.senderId !== senderId));
    };

    socket.on("groupTyping", handleGroupTyping);
    socket.on("groupStopTyping", handleGroupStopTyping);

    return () => {
      socket.off("groupTyping");
      socket.off("groupStopTyping");
    };
  }, [currentGroup?._id, currentUserId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("sendGroupMessage", {
        groupId: currentGroup._id,
        text: newMessage.trim(),
        fileUrl: null,
        fileType: null,
      });
      setNewMessage("");
      // Emit stop typing when message is sent
      socket.emit("groupStopTyping", { groupId: currentGroup._id });
    }
  };

  const handleFileUpload = ({ fileUrl, fileType }) => {
    socket.emit("sendGroupMessage", {
      groupId: currentGroup._id,
      text: "",
      fileUrl,
      fileType,
    });
  };

  if (!currentGroup) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a group to start chatting
      </div>
    );
  }

  const typingUsersList = typingUsers
    .map((user) => user.senderName || "Someone")
    .filter(Boolean)
    .join(", ");

  return (
    <div className="h-full w-full bg-[#07111B] overflow-hidden relative flex flex-col">
      {/* Unified Header - Works for both 1-on-1 and groups */}
      <ChatHeaderUnified
        selectedUser={currentGroup}
        isGroup={true}
        onBack={onBack}
        onMoreClick={() => setShowMembers(true)}
      />

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-25 -left-25 h-125 w-125 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute -bottom-37.5 -right-25 h-125 w-125 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* Messages */}
      <div
        className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5 chat-scrollbar"
        ref={chatContainerRef}
      >
        {groupMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-center">
            No messages yet. Start the conversation!
          </div>
        ) : (
          groupMessages.map((msg, index) => {
            const isMe = msg.senderId?._id === currentUserId || msg.senderId === currentUserId;

            return (
              <MessageBubble
                key={msg._id || index}
                message={msg}
                isMe={isMe}
                currentUserId={currentUserId}
                showSenderInfo={true}
                showSeenStatus={false}
                onImageClick={(imageUrl) => setPreviewImage(imageUrl)}
              />
            );
          })
        )}
      </div>

      {/* Typing Indicator */}
      {typingUsersList && (
        <div className="relative z-10 px-3 sm:px-4 pb-2 text-xs text-gray-400 italic">
          {typingUsersList} is typing...
        </div>
      )}

      {/* Image Preview Modal */}
      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {/* Chat Input Area */}
      <ChatInputArea
        newMessage={newMessage}
        setNewMessage={(text) => {
          setNewMessage(text);
          handleTyping(text);
        }}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        onTyping={() => {}} // Typing is handled via setNewMessage callback
        placeholder="Type a message..."
        showEmoji={false}
      />

      {/* Members Modal */}
      {showMembers && (
        <GroupMembers
          onAddMemberClick={() => {
            // Handle add member
            setShowMembers(false);
          }}
          onClose={() => setShowMembers(false)}
        />
      )}
    </div>
  );
};

export default GroupChat;
