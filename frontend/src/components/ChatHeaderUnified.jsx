import React, { useContext, useState } from "react";
import { FiVideo, FiPhone, FiMoreVertical, FiArrowLeft, FiSettings, FiMessageSquare } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { ChatContext } from "../context/ChatContext";
import Avatar from "./ui/Avatar";

/**
 * Unified Chat Header Component
 * Supports both 1-on-1 and group chats with configurable props
 * 
 * @param {Object} selectedUser - User/Group object with _id, username, name, etc.
 * @param {boolean} isGroup - Whether this is a group chat
 * @param {Function} onBack - Callback for back button
 * @param {Function} onMoreClick - Callback for more options button (groups)
 * @param {string} currentUsername - Current user's username
 * @param {boolean} isTyping - Show typing indicator (1-on-1 only)
 * @param {Array} onlineUsers - List of online user IDs (1-on-1 only)
 */
const ChatHeaderUnified = ({
  selectedUser,
  isGroup = false,
  onBack,
  onMoreClick,
  currentUsername,
  isTyping = false,
  onlineUsers = [],
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { onlineUsers: contextOnlineUsers } = useContext(ChatContext);

  if (!selectedUser) return null;

  const isOnline = contextOnlineUsers?.includes(selectedUser._id) || onlineUsers?.includes(selectedUser._id);
  const displayName = isGroup ? selectedUser.name : selectedUser.username;
  const subtitle = isGroup 
    ? `${selectedUser.members?.length || 0} member${selectedUser.members?.length !== 1 ? "s" : ""}`
    : isTyping ? "typing..." : "Active now";

  return (
    <div className="h-16 sm:h-20 bg-[#0D2038] border-b border-[#1A3A5C] px-3 sm:px-5 py-2 sm:py-4 flex items-center justify-between shrink-0">
      
      {/* LEFT SIDE - User/Group Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Back Button - Mobile Only */}
        <button
          onClick={onBack}
          className="lg:hidden text-gray-400 hover:text-white transition p-1"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Avatar - Unified for both types */}
        <div className="relative shrink-0">
          {isGroup ? (
            <Avatar
              name={displayName}
              isGroup={true}
              size="md"
            />
          ) : (
            <>
              <img
                src={`https://ui-avatars.com/api/?name=${selectedUser.username}&background=0D8ABC&color=fff`}
                alt={selectedUser.username}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0B141A] rounded-full ${
                  isOnline ? "bg-green-500" : "bg-gray-500"
                }`}
              />
            </>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-sm sm:text-base truncate">
            {displayName}
          </p>
          <p className={`text-xs sm:text-sm ${
            isTyping && !isGroup ? "text-green-400" : "text-[#8EA7A3]"
          }`}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Phone Call - 1-on-1 only */}
        {!isGroup && (
          <button className="text-gray-300 hover:text-white hover:bg-[#1a3a5c] p-2 rounded-lg transition hidden sm:inline-flex">
            <FiPhone className="h-5 w-5" />
          </button>
        )}

        {/* Video Call - 1-on-1 only */}
        {!isGroup && (
          <button className="text-gray-300 hover:text-white hover:bg-[#1a3a5c] p-2 rounded-lg transition hidden sm:inline-flex">
            <FiVideo className="h-5 w-5" />
          </button>
        )}

        {/* More Options Button */}
        <div className="relative">
          <button
            onClick={() => {
              if (isGroup) {
                onMoreClick?.();
              } else {
                setShowMenu(!showMenu);
              }
            }}
            className="text-gray-300 hover:text-white hover:bg-[#1a3a5c] p-2 rounded-lg transition"
          >
            <FiMoreVertical className="h-5 w-5" />
          </button>

          {/* Dropdown Menu - 1-on-1 only */}
          {showMenu && !isGroup && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0D2038] border border-[#1A3A5C] rounded-lg shadow-lg z-50">
              <button className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-[#1a3a5c] text-sm first:rounded-t-lg transition flex items-center gap-2">
                <FaUserCircle className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-[#1a3a5c] text-sm transition flex items-center gap-2">
                <FiPhone className="w-4 h-4" />
                <span>Voice</span>
              </button>
              <button className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-[#1a3a5c] text-sm transition flex items-center gap-2">
                <FiVideo className="w-4 h-4" />
                <span>Video</span>
              </button>
              <button className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-[#1a3a5c] text-sm transition flex items-center gap-2">
                <FiSettings className="w-4 h-4" />
                <span>Block</span>
              </button>
              <button className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-[#1a3a5c] text-sm last:rounded-b-lg transition flex items-center gap-2">
                <FiMessageSquare className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeaderUnified;
