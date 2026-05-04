import React, { useContext } from "react";
import { GroupContext } from "../../context/GroupContext";
import { FiMoreVertical, FiArrowLeft } from "react-icons/fi";
import Avatar from "../ui/Avatar";

const GroupHeader = ({ onBack, onMoreClick }) => {
  const { currentGroup } = useContext(GroupContext);

  if (!currentGroup) {
    return null;
  }

  return (
    <div className="h-20 bg-[#0D2038] border-b border-[#1A3A5C] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[#1a3a5c] rounded-lg transition lg:hidden"
        >
          <FiArrowLeft size={20} className="text-white" />
        </button>

        {/* Group Avatar */}
        <Avatar
          name={currentGroup.name}
          isGroup={true}
          size="md"
        />

        {/* Group Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-white truncate">
            {currentGroup.name}
          </h2>
          <p className="text-sm text-gray-400">
            {currentGroup.members.length} member{currentGroup.members.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* More Options */}
      <button
        onClick={onMoreClick}
        className="p-2 hover:bg-[#1a3a5c] rounded-lg transition"
      >
        <FiMoreVertical size={20} className="text-gray-400" />
      </button>
    </div>
  );
};

export default GroupHeader;
