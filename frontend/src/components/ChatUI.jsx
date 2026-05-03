import React, { useEffect, useRef, useState } from "react";
import { BsCheck, BsCheck2All, BsEmojiSmile, BsPlusLg, BsSendFill } from "react-icons/bs";
import Input from "./ui/Input";
import Button from "./ui/Button";
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
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!previewImage) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setPreviewImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewImage]);

  // ✅ File upload handler (no UI change)
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

      socket.emit("sendMessage", {
        senderId: currentUserId,
        receiverId: selectedUser._id,
        text: "",
        fileUrl: data.fileUrl,
        fileType: data.fileType,
      });

    } catch (error) {
      console.error("File upload error:", error);
    }
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
            const messageTime =
              msg.time ||
              (msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "");

            return (
              <div
                key={msg._id || msg.id || index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[60%] rounded-2xl overflow-hidden shadow-2xl border border-white/5 ${
                    isMe
                      ? "bg-[#1E5EC7] text-white rounded-br-md"
                      : "bg-[#13263E]/95 text-gray-200 rounded-bl-md"
                  }`}
                >

                  {/* ✅ FILE SUPPORT (only change here) */}
                  {msg.fileUrl && (
                    msg.fileType?.startsWith("image") ? (
                      <div className="p-2 pb-0">
                        <button
                          type="button"
                          onClick={() => setPreviewImage(msg.fileUrl)}
                          className="block w-full overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-sky-400/70"
                        >
                          <img
                            src={msg.fileUrl}
                            alt="preview"
                            className="h-40 sm:h-64 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                          />
                        </button>
                      </div>
                    ) : (
                      <div className="p-2">
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-300 underline text-sm"
                        >
                          Download file
                        </a>
                      </div>
                    )
                  )}

                  <div className="px-3 sm:px-4 py-2 sm:py-3">
                    <p className="text-sm leading-relaxed">{msg.text}</p>

                    <div
                      className={`text-[11px] mt-2 flex justify-end ${
                        isMe ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {isMe ? (
                        <div className="flex items-center gap-1.5">
                          <span>{messageTime}</span>
                          {msg.seen ? (
                            <BsCheck2All className="text-[#7dd3fc]" size={14} />
                          ) : (
                            <BsCheck className="text-white/60" size={14} />
                          )}
                        </div>
                      ) : (
                        <span>{messageTime}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-full max-w-6xl w-full flex items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-2 -right-2 sm:top-0 sm:right-0 z-10 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center"
              aria-label="Close image preview"
            >
              <span className="text-2xl leading-none">×</span>
            </button>

            <img
              src={previewImage}
              alt="Expanded preview"
              className="max-h-[88vh] max-w-full rounded-2xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 px-2 sm:px-3 py-2 sm:py-3 bg-[#0F1E35]/90 border-t border-[#1A3A5C] backdrop-blur-xl">
        <div className="flex items-center gap-2 sm:gap-3">

          {/* ✅ Hidden input (NEW but invisible) */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFile}
          />

          {/* ✅ + Button (same UI, just added onClick) */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-gray-400 hover:text-white transition shrink-0"
          >
            <BsPlusLg size={18} className="sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping?.(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              onBlur={() => handleTyping?.("")}
              placeholder={`Message ${selectedUser?.username || 'user'}`}
            />
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="text-gray-400 hover:text-white">
              <BsEmojiSmile size={18} />
            </button>

            <Button
              size="sm"
              variant="primary"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <BsSendFill />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;