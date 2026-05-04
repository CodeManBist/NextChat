import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./ui/MessageBubble";
import ImagePreviewModal from "./ui/ImagePreviewModal";
import ChatInputArea from "./ui/ChatInputArea";
import socket from "../socket";

const ChatUI = ({
  selectedUser,
  messages = [],
  newMessage,
  setNewMessage,
  sendMessage,
  handleTyping,
  currentUserId,
  currentUsername,
  isEmpty,
  isTyping,
  chatContainerRef,
  handleScroll,
  onlineUsers,
}) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileUpload = ({ fileUrl, fileType }) => {
    socket.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      text: "",
      fileUrl,
      fileType,
    });
  };

  return (
    <div className="h-full w-full bg-[#07111B] overflow-hidden relative flex flex-col">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-25 -left-25 h-125 w-125 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute -bottom-37.5 -right-25 h-125 w-125 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 h-40 w-40 rounded-full border border-blue-400/20" />
          <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full border border-sky-400/10" />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/10" />
        </div>
      </div>

      {/* Messages Container */}
      <div
        className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5 chat-scrollbar"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {isEmpty ? (
          <div className="h-full min-h-75 flex items-center justify-center text-[#8EA7A3] text-center px-4 sm:px-6">
            Start chatting with {selectedUser?.username}.
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId || msg.sender === "me";

            return (
              <MessageBubble
                key={msg._id || msg.id || index}
                message={msg}
                isMe={isMe}
                currentUserId={currentUserId}
                showSenderInfo={false}
                showSeenStatus={true}
                onImageClick={(imageUrl) => setPreviewImage(imageUrl)}
              />
            );
          })
        )}
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {/* Chat Input Area */}
      <ChatInputArea
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={sendMessage}
        onFileUpload={handleFileUpload}
        onTyping={handleTyping}
        placeholder={`Message ${selectedUser?.username || 'user'}`}
        showEmoji={true}
      />
    </div>
  );
};

export default ChatUI;