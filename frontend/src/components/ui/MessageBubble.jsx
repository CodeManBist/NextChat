import React from "react";
import { BsCheck, BsCheck2All } from "react-icons/bs";
import Avatar from "./Avatar";

const MessageBubble = ({
  message,
  isMe,
  currentUserId,
  showSenderInfo = false,
  showSeenStatus = false,
  onImageClick,
}) => {
  const messageTime = message.time ||
    (message.createdAt
      ? new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "");

  // Get sender name (for group chats)
  const senderName = message.senderId?.username || message.sender || "Unknown";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} gap-2 max-w-[75%] sm:max-w-[60%]`}>
        {/* Sender Avatar (for groups) */}
        {showSenderInfo && !isMe && (
          <Avatar name={senderName} size="sm" />
        )}

        <div>
          {/* Sender Name (for groups) */}
          {showSenderInfo && !isMe && (
            <p className="text-xs text-gray-400 mb-1 px-3">{senderName}</p>
          )}

          {/* Message Bubble */}
          <div
            className={`rounded-2xl overflow-hidden shadow-2xl border border-white/5 ${
              isMe
                ? "bg-[#1E5EC7] text-white rounded-br-md"
                : "bg-[#13263E]/95 text-gray-200 rounded-bl-md"
            }`}
          >
            {/* File Support - Image */}
            {message.fileUrl && message.fileType?.startsWith("image") && (
              <div className="p-2 pb-0">
                <button
                  type="button"
                  onClick={() => onImageClick?.(message.fileUrl)}
                  className="block w-full overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-sky-400/70"
                >
                  <img
                    src={message.fileUrl}
                    alt="preview"
                    className="h-40 sm:h-64 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                </button>
              </div>
            )}

            {/* File Support - Other */}
            {message.fileUrl && !message.fileType?.startsWith("image") && (
              <div className="p-2">
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-300 underline text-sm"
                >
                  Download file
                </a>
              </div>
            )}

            {/* Message Text */}
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <p className="text-sm leading-relaxed">{message.text}</p>

              {/* Timestamp & Status */}
              <div
                className={`text-[11px] mt-2 flex justify-end ${
                  isMe ? "text-white/70" : "text-gray-400"
                }`}
              >
                {isMe && showSeenStatus ? (
                  <div className="flex items-center gap-1.5">
                    <span>{messageTime}</span>
                    {message.seen ? (
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
      </div>
    </div>
  );
};

export default MessageBubble;
