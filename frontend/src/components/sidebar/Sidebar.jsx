import React from "react";
import {
  FiMessageSquare,
  FiUsers,
  FiSettings,
  FiSearch,
  FiArrowLeft,
} from "react-icons/fi";

import { MdOutlineRadioButtonChecked } from "react-icons/md";
import ChatsSection from "./ChatsSection";

const Sidebar = ({ activeMenu, setActiveMenu, selectedUser, setSelectedUser }) => {
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

  // MAIN MENU
  if (!activeMenu) {
    return (
      <div className="w-[320px] h-screen bg-[#08141B] border-r border-[#1A2A33] p-4">
        <h2 className="text-green-400 text-3xl font-semibold mb-8">
          Menu
        </h2>

        <div className="space-y-2">
          {menus.map((menu) => (
            <div
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-[#132029] cursor-pointer transition"
            >
              {menu.icon}

              <span>{menu.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

   // CHATS PAGE
if (activeMenu === "chats") {
  return (
    <div className="w-[380px] h-screen bg-[#08141B] border-r border-[#1A2A33] flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <FiArrowLeft
          size={22}
          className="cursor-pointer text-white"
          onClick={() => setActiveMenu(null)}
        />

        <h2 className="text-2xl font-semibold text-green-400">
          Chats
        </h2>
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-hidden">
        <ChatsSection
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>

    </div>
  );
}

  // STATUS PAGE
  if (activeMenu === "status") {
    return (
      <div className="w-[320px] h-screen bg-[#08141B] border-r border-[#1A2A33] p-4">
        <div className="flex items-center gap-3 mb-6">
          <FiArrowLeft
            size={22}
            className="cursor-pointer text-white"
            onClick={() => setActiveMenu(null)}
          />

          <h2 className="text-2xl font-semibold text-green-400">
            Status
          </h2>
        </div>

        <div className="text-gray-400">
          Status content here
        </div>
      </div>
    );
  }

  // CHANNELS PAGE
  if (activeMenu === "channels") {
    return (
      <div className="w-[320px] h-screen bg-[#08141B] border-r border-[#1A2A33] p-4">
        <div className="flex items-center gap-3 mb-6">
          <FiArrowLeft
            size={22}
            className="cursor-pointer text-white"
            onClick={() => setActiveMenu(null)}
          />

          <h2 className="text-2xl font-semibold text-green-400">
            Channels
          </h2>
        </div>

        <div className="text-gray-400">
          Channels content here
        </div>
      </div>
    );
  }

  // SETTINGS PAGE
  if (activeMenu === "settings") {
    return (
      <div className="w-[320px] h-screen bg-[#08141B] border-r border-[#1A2A33] p-4">
        <div className="flex items-center gap-3 mb-6">
          <FiArrowLeft
            size={22}
            className="cursor-pointer text-white"
            onClick={() => setActiveMenu(null)}
          />

          <h2 className="text-2xl font-semibold text-green-400">
            Settings
          </h2>
        </div>

        <div className="text-gray-400">
          Settings content here
        </div>
      </div>
    );
  }
};

export default Sidebar;