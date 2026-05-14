import React, { useRef, useState } from "react";
import { BsPlusLg, BsSendFill, BsEmojiSmile } from "react-icons/bs";
import Input from "./Input";
import Button from "./Button";
import EmojiPickerPopup from "./EmojiPickerPopup";

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
  const [showPicker, setShowPicker] = useState(false);

  const fileInputRef = useRef(null);

  const handleEmojiSelect = (emojiData) => {
    const emoji = emojiData.emoji;
    setNewMessage((prev) => prev + emoji);
  };

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
    <div className="relative z-10 px-2 sm:px-3 py-2 sm:py-3 theme-panel border-t theme-border backdrop-blur-2xl">
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
          className="shrink-0 p-2 rounded-xl transition text-white/45 hover:text-white hover:bg-white/6"
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
            className="shrink-0 p-2 rounded-xl transition text-white/45 hover:text-white hover:bg-white/6"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            <BsEmojiSmile size={20} />
          </button>
        )}

        {/* Send Button */}
        <button
          onClick={onSendMessage}
          disabled={!newMessage.trim() || disabled}
          className="shrink-0 rounded-xl bg-white px-3 py-3 text-black transition hover:scale-[1.02] hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <BsSendFill size={18} />
        </button>
      </div>
      <EmojiPickerPopup
        show={showPicker}
        onClose={() => setShowPicker(false)}
        onEmojiSelect={handleEmojiSelect}
      />
    </div>
  );
};

export default ChatInputArea;
