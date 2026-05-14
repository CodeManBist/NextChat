import React, { useMemo, useRef, useState } from "react";
import { BsCheck, BsCheck2All } from "react-icons/bs";
import Avatar from "./Avatar";
import EmojiPickerPopup from "./EmojiPickerPopup";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MessageBubble = ({
  message,
  isMe,
  currentUserId,
  showSenderInfo = false,
  showSeenStatus = false,
  onImageClick,
  allowReactions = false,
  reactionPosition = "bottom-12 right-0",
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactionError, setReactionError] = useState("");
  const reactionButtonRef = useRef(null);
  const [reactionPickerStyle, setReactionPickerStyle] = useState(null);

  const messageTime = message.time ||
    (message.createdAt
      ? new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "");

  // Get sender name (for group chats)
  const senderName = message.senderId?.username || message.sender || "Unknown";

  const reactions = Array.isArray(message.reactions) ? message.reactions : [];

  const reactionSummary = useMemo(() => {
    const summary = new Map();

    reactions.forEach((reaction) => {
      const emoji = reaction.emoji;
      if (!emoji) return;

      const existing = summary.get(emoji) || { emoji, count: 0, reactedByMe: false };
      existing.count += 1;

      const reactionUserId = reaction.userId?._id || reaction.userId;
      if (reactionUserId?.toString() === currentUserId?.toString()) {
        existing.reactedByMe = true;
      }

      summary.set(emoji, existing);
    });

    return Array.from(summary.values());
  }, [reactions, currentUserId]);

  const myReaction = reactions.find((reaction) => {
    const reactionUserId = reaction.userId?._id || reaction.userId;
    return reactionUserId?.toString() === currentUserId?.toString();
  });

  const openReactionPicker = () => {
    const buttonRect = reactionButtonRef.current?.getBoundingClientRect();

    if (buttonRect) {
      const estimatedWidth = window.innerWidth < 640 ? 320 : 340;
      const estimatedHeight = window.innerWidth < 640 ? 320 : 400;
      const margin = 8;

      const fitsRight = buttonRect.right + estimatedWidth + margin <= window.innerWidth;
      const fitsBelow = buttonRect.bottom + estimatedHeight + margin <= window.innerHeight;

      const left = fitsRight
        ? buttonRect.right + margin
        : Math.max(margin, buttonRect.left - estimatedWidth - margin);

      const top = fitsBelow
        ? buttonRect.bottom + margin
        : Math.max(margin, buttonRect.top - estimatedHeight - margin);

      setReactionPickerStyle({
        position: "fixed",
        top,
        left,
        zIndex: 60,
      });
    }

    setShowReactionPicker(true);
  };

  const updateReaction = async (emoji) => {
    if (!allowReactions || !message?._id) return;

    try {
      setReactionError("");

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (myReaction?.emoji === emoji) {
        const response = await fetch(`${API_BASE_URL}/api/messages/${message._id}/reaction`, {
          method: "DELETE",
          headers,
        });

        if (!response.ok) {
          throw new Error("Failed to remove reaction");
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/api/messages/${message._id}/reaction`, {
          method: "POST",
          headers,
          body: JSON.stringify({ emoji }),
        });

        if (!response.ok) {
          throw new Error("Failed to react to message");
        }
      }

      setShowReactionPicker(false);
      window.dispatchEvent(new CustomEvent("messageReactionUpdated"));
    } catch (error) {
      setReactionError(error.message || "Reaction update failed");
    }
  };

  return (
    <div className={`group relative flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} gap-2 max-w-[75%] sm:max-w-[60%]`}>
        {/* Sender Avatar (for groups) */}
        {showSenderInfo && !isMe && (
          <Avatar name={senderName} size="sm" />
        )}

        <div className="relative">
          {/* Sender Name (for groups) */}
          {showSenderInfo && !isMe && (
            <p className="text-xs text-white/40 mb-1 px-3">{senderName}</p>
          )}

          {/* Message Bubble */}
          <div
            className={`rounded-2xl overflow-hidden shadow-2xl border border-white/5 ${
              isMe
                ? "bg-white text-black rounded-br-md"
                : "bg-white/5 text-white rounded-bl-md"
            }`}
          >

          {/* IMAGE */}
          {message.fileUrl && message.fileType === "image" && (
            <div className="p-2 pb-0">
              <button
                type="button"
                onClick={() => onImageClick?.(message.fileUrl)}
                className="block w-full overflow-hidden rounded-xl"
              >
                <img
                  src={message.fileUrl}
                  alt="preview"
                  className="h-40 sm:h-64 w-full object-cover"
                />
              </button>
            </div>
          )}

          {/* VIDEO */}
          {message.fileUrl && message.fileType === "video" && (
            <div className="p-2">
              <video
                controls
                className="w-full rounded-xl max-h-80"
              >
                <source src={message.fileUrl} />
              </video>
            </div>
          )}

        {/* AUDIO */}
        {message.fileUrl && message.fileType === "audio" && (
          <div
            className={`flex ${
              isMe ? "justify-end" : "justify-start"
            } p-2`}
          >
            <div
              className={`
                max-w-70
                rounded-2xl
                overflow-visible
                ${isMe ? "bg-[#2563eb]" : "bg-[#1e293b]"}
              `}
            >
              <audio
                controls
                className="
                  w-full
                  min-w-62.5
                  h-12
                "
              >
              <source
                  src={message.fileUrl}
                  type="audio/webm"
                />
              </audio>
            </div>
          </div>
        )}
          {/* DOCUMENT / OTHER FILE */}
          {message.fileUrl && message.fileType === "file" && (
            <div className="p-3">
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 underline text-sm"
              >
                Download File
              </a>
            </div>
          )}

            {/* Message Text */}
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <p className="text-sm leading-relaxed">{message.text}</p>

              {/* Timestamp & Status */}
              <div
                className={`text-[11px] mt-2 flex justify-end ${
                  isMe ? "text-black/55" : "text-white/45"
                }`}
              >
                {isMe && showSeenStatus ? (
                  <div className="flex items-center gap-1.5">
                    <span>{messageTime}</span>
                    {message.seen ? (
                      <BsCheck2All className="text-cyan-300" size={14} />
                    ) : (
                      <BsCheck className="text-black/45" size={14} />
                    )}
                  </div>
                ) : (
                  <span>{messageTime}</span>
                )}
              </div>
            </div>
          </div>

          {allowReactions && (
            <div className="relative mt-1 flex flex-wrap items-center justify-end gap-1.5 px-1">
              {reactionSummary.map((reaction) => (
                <button
                  key={reaction.emoji}
                  type="button"
                  onClick={() => updateReaction(reaction.emoji)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs shadow-lg transition ${
                    reaction.reactedByMe
                      ? "border-white/15 bg-white/15 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                  }`}
                  aria-label={`React with ${reaction.emoji}`}
                >
                  <span>{reaction.emoji}</span>
                  {reaction.count > 1 && <span>{reaction.count}</span>}
                </button>
              ))}

              <button
                ref={reactionButtonRef}
                type="button"
                onClick={openReactionPicker}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 opacity-0 shadow-lg transition group-hover:opacity-100 hover:bg-white/10"
                aria-label="Open emoji reactions"
              >
                +
              </button>

              {reactionError && (
                <span className="w-full text-[11px] text-red-300">{reactionError}</span>
              )}
            </div>
          )}

          {showReactionPicker && (
            <EmojiPickerPopup
              show={showReactionPicker}
              onClose={() => setShowReactionPicker(false)}
              onEmojiSelect={(emojiData) => updateReaction(emojiData.emoji)}
              position={reactionPosition}
              style={reactionPickerStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
