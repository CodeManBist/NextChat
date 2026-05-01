import React, { useContext, useState } from "react";
import { FiVideo, FiPhone, FiMoreVertical, FiArrowLeft, FiSettings, FiMessageSquare } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { ChatContext } from "../context/ChatContext";

const ChatHeader = ({ selectedUser, currentUsername, isTyping, onBack, onlineUsers }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { onlineUsers: contextOnlineUsers } = useContext(ChatContext);

  if (!selectedUser) return null;

  return (
    <div className="h-16 sm:h-20 bg-[#0D2038] border-b border-[#1A3A5C] px-3 sm:px-5 py-2 sm:py-4 flex items-center justify-between flex-shrink-0">
      
      {/* LEFT SIDE - User Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Back Button - Mobile Only */}
        <button
          onClick={onBack}
          className="lg:hidden text-gray-400 hover:text-white transition p-1"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* User Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={`https://ui-avatars.com/api/?name=${selectedUser.username}&background=0D8ABC&color=fff`}
            alt={selectedUser.username}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          />
          <span 
            className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0B141A] rounded-full ${
                contextOnlineUsers?.includes(selectedUser._id)
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
            ></span>
        </div>

        {/* User Details */}
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-sm sm:text-base truncate">
            {selectedUser.username}
          </p>
          <p className="text-xs sm:text-sm text-[#8EA7A3]">
            {isTyping ? (
              <span className="text-green-400">typing...</span>
            ) : (
              "Active now"
            )}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Phone Call */}
        <button className="text-gray-300 hover:text-white hover:bg-[#1a3a5c] p-2 rounded-lg transition hidden sm:inline-flex">
          <FiPhone className="h-5 w-5" />
        </button>

        {/* Video Call */}
        <button className="text-gray-300 hover:text-white hover:bg-[#1a3a5c] p-2 rounded-lg transition hidden sm:inline-flex">
          <FiVideo className="h-5 w-5" />
        </button>

        {/* More Options */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-300 hover:text-white hover:bg-[#1a3a5c] p-2 rounded-lg transition"
          >
            <FiMoreVertical className="h-5 w-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
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

export default ChatHeader;
