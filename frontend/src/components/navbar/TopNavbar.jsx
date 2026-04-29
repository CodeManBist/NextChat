import React from "react";
import { FiVideo, FiPhone, FiMoreVertical } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

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
          <FiVideo className="h-5 w-5" />
        </button>

        <button className="hover:text-white">
          <FiPhone className="h-5 w-5" />
        </button>

        <button className="hover:text-white">
          <FiMoreVertical className="h-5 w-5" />
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-orange-400 cursor-pointer flex items-center justify-center overflow-hidden">
          <FaUserCircle className="h-9 w-9 text-white" />
        </div>

      </div>

    </div>
  );
};

export default TopNavbar;