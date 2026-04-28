import React from "react";

const Sidebar = () => {
  return (
    <div className="w-[270px] bg-[#08141B] border-r border-[#1A2A33] p-4">

      <h2 className="text-green-400 text-3xl font-semibold mb-8">
        Chats
      </h2>

      <div className="space-y-2">

        <div className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-[#132029] cursor-pointer">
          <span>💬</span>
          <span>Chats</span>
        </div>

        <div className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-[#132029] cursor-pointer">
          <span>⭕</span>
          <span>Status</span>
        </div>

        <div className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-[#132029] cursor-pointer">
          <span>👥</span>
          <span>Channels</span>
        </div>

        <div className="flex items-center gap-4 px-4 py-4 rounded-xl bg-[#132029] text-green-400 cursor-pointer">
          <span>⚙️</span>
          <span>Settings</span>
        </div>

      </div>

    </div>
  );
};

export default Sidebar;