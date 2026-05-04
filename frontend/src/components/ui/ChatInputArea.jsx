import React, { useRef } from "react";
import { BsPlusLg, BsSendFill, BsEmojiSmile } from "react-icons/bs";
import Input from "./Input";
import Button from "./Button";
import socket from "../../socket";

const ChatInputArea = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onFileUpload,
  onTyping,
  placeholder = "Type a message...",
  showEmoji = true,
  disabled = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      onFileUpload?.({
        fileUrl: data.fileUrl,
        fileType: data.fileType,
      });
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  return (
    <div className="relative z-10 px-2 sm:px-3 py-2 sm:py-3 bg-[#0F1E35]/90 border-t border-[#1A3A5C] backdrop-blur-xl">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFile}
        />

        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 p-2 hover:bg-[#1a3a5c] rounded-lg transition text-gray-400 hover:text-white"
          disabled={disabled}
        >
          <BsPlusLg size={20} />
        </button>

        {/* Message Input */}
        <div className="flex-1">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              onTyping?.(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage?.();
              }
            }}
            onBlur={() => onTyping?.("")}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>

        {/* Emoji Button (optional) */}
        {showEmoji && (
          <button
            type="button"
            className="shrink-0 p-2 hover:bg-[#1a3a5c] rounded-lg transition text-gray-400 hover:text-white"
            disabled={disabled}
          >
            <BsEmojiSmile size={20} />
          </button>
        )}

        {/* Send Button */}
        <button
          onClick={onSendMessage}
          disabled={!newMessage.trim() || disabled}
          className="shrink-0 p-2 hover:bg-blue-600 bg-blue-500 rounded-lg transition text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BsSendFill size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInputArea;
