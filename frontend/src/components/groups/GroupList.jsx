import React, { useContext } from "react";
import { GroupContext } from "../../context/GroupContext";
import { FiUsers, FiPlus } from "react-icons/fi";

const GroupList = ({ onSelectGroup, onCreateClick, selectedGroupId }) => {
  const { groups, loading } = useContext(GroupContext);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto chat-scrollbar p-4">
        <div className="text-gray-400 text-center">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0F1E35] text-white">
      {/* Header */}
      <div className="p-4 border-b border-[#1A3A5C]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FiUsers size={20} />
            Groups
          </h3>
          <button
            onClick={onCreateClick}
            className="p-2 hover:bg-[#1a3a5c] rounded-lg transition"
            title="Create new group"
          >
            <FiPlus size={20} />
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div
              key={group._id}
              onClick={() => onSelectGroup(group)}
              className={`flex items-center gap-4 px-4 py-4 cursor-pointer transition duration-200 ${
                selectedGroupId === group._id
                  ? "bg-[#1a3a5c]"
                  : "hover:bg-[#1a2f4a]"
              }`}
            >
              {/* Group Avatar */}
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                  {group.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Group Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-medium truncate text-white">{group.name}</h2>
                <p className="text-sm text-gray-400 truncate">
                  {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FiUsers size={32} className="mx-auto mb-2 opacity-50" />
              <p>No groups yet</p>
              <button
                onClick={onCreateClick}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
              >
                Create Group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
