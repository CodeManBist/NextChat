import React from "react";
import {
  FiMessageSquare,
  FiUsers,
  FiSettings,
  FiArrowLeft,
} from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { MdOutlineRadioButtonChecked } from "react-icons/md";
import ChatsSection from "./ChatsSection";

const Sidebar = ({ activeMenu, setActiveMenu, selectedUser, setSelectedUser, onSelectUser }) => {
  const menus = [
    {
      id: "chats",
      label: "Chats",
      icon: <FiMessageSquare size={20} />,
    },
    {
      id: "status",
      label: "Status",
      icon: <MdOutlineRadioButtonChecked size={20} />,
    },
    {
      id: "channels",
      label: "Channels",
      icon: <FiUsers size={20} />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FiSettings size={20} />,
    },
  ];

  const navigate = useNavigate();

  // MAIN MENU
  if (!activeMenu) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-[#0F1E35] to-[#0C2740] border-r border-[#12324a] p-4 flex flex-col">
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-transparent to-transparent opacity-80" />
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <FiMessageCircle className="text-blue-400 w-6 h-6" />
            <span className="text-white font-semibold text-lg">NextChat</span>
          </button>
          
        </div>

        <div className="space-y-2 flex-1">
          {menus.map((menu) => (
            <div
              key={menu.id}
              onClick={() => {
                setActiveMenu(menu.id);
              }}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-300 hover:bg-[#1a3a5c] cursor-pointer transition"
            >
              {menu.icon}
              <span className="hidden sm:inline">{menu.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

   // CHATS PAGE
if (activeMenu === "chats") {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#0F1E35] to-[#0C2740] border-r border-[#12324a] flex flex-col">
      <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-transparent to-transparent opacity-80" />

      {/* Header */}
      <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-[#1A3A5C] bg-[#07111B] sm:bg-transparent">
        <FiArrowLeft
          size={22}
          className="cursor-pointer text-white flex-shrink-0"
          onClick={() => {
            if (selectedUser) {
              // If a user is selected, go back to the chats list instead of closing the menu
              setSelectedUser(null);
            } else {
              setActiveMenu(null);
            }
          }}
        />

        <h2 className="text-xl sm:text-2xl font-semibold text-blue-400">
          Chats
        </h2>
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-hidden">
        <ChatsSection
          selectedUser={selectedUser}
          setSelectedUser={(user) => {
            setSelectedUser(user);
            onSelectUser?.();
          }}
        />
      </div>

    </div>
  );
}

  // STATUS PAGE
  if (activeMenu === "status") {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-[#0F1E35] to-[#0C2740] border-r border-[#12324a] p-4 flex flex-col">
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-transparent to-transparent opacity-80" />
        <div className="flex items-center gap-3 mb-6">
          <FiArrowLeft
            size={22}
            className="cursor-pointer text-white"
            onClick={() => setActiveMenu(null)}
          />

          <h2 className="text-xl sm:text-2xl font-semibold text-blue-400">
            Status
          </h2>
        </div>

        <div className="text-gray-400 flex-1 flex items-center justify-center">
          
        </div>
      </div>
    );
  }

  // CHANNELS PAGE
  if (activeMenu === "channels") {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-[#0F1E35] to-[#0C2740] border-r border-[#12324a] p-4 flex flex-col">
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-transparent to-transparent opacity-80" />
        <div className="flex items-center gap-3 mb-6">
          <FiArrowLeft
            size={22}
            className="cursor-pointer text-white"
            onClick={() => setActiveMenu(null)}
          />

          <h2 className="text-xl sm:text-2xl font-semibold text-blue-400">
            Channels
          </h2>
        </div>

        <div className="text-gray-400 flex-1 flex items-center justify-center">
          
        </div>
      </div>
    );
  }

  // SETTINGS PAGE
  if (activeMenu === "settings") {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-[#0F1E35] to-[#0C2740] border-r border-[#12324a] p-4 flex flex-col">
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-transparent to-transparent opacity-80" />
        <div className="flex items-center gap-3 mb-6">
          <FiArrowLeft
            size={22}
            className="cursor-pointer text-white"
            onClick={() => setActiveMenu(null)}
          />

          <h2 className="text-xl sm:text-2xl font-semibold text-blue-400">
            Settings
          </h2>
        </div>

        <div className="text-gray-400 flex-1 flex items-center justify-center">
          
        </div>
      </div>
    );
  }
};

export default Sidebar;