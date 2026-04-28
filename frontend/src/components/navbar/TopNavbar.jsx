import React from "react";

const TopNavbar = () => {
  return (
    <div className="h-[70px] bg-[#08141B] border-b border-[#1A2A33] flex items-center justify-between px-6">

      {/* Logo */}
      <h1 className="text-white text-3xl font-bold">
        Messenger
      </h1>

      {/* Right Icons */}
      <div className="flex items-center gap-6 text-gray-400">

        <button className="hover:text-white">
          📹
        </button>

        <button className="hover:text-white">
          📞
        </button>

        <button className="hover:text-white">
          ⋮
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-orange-400 cursor-pointer"></div>

      </div>

    </div>
  );
};

export default TopNavbar;