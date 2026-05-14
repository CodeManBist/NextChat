import React, { useContext } from "react";
import { GroupContext } from "../../context/GroupContext";
import { FiUsers, FiPlus } from "react-icons/fi";

const GroupList = ({ onSelectGroup, onCreateClick, selectedGroupId }) => {
  const { groups, loading } = useContext(GroupContext);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto chat-scrollbar p-4">
        <div className="text-white/40 text-center">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full theme-panel text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FiUsers size={20} />
            Groups
          </h3>
          <button
            onClick={onCreateClick}
            className="p-2 hover:bg-white/6 rounded-xl transition"
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
                  ? "bg-white/8"
                  : "hover:bg-white/4"
              }`}
            >
              {/* Group Avatar */}
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#1c1c22] to-[#2e2935] border border-white/10 flex items-center justify-center text-white font-semibold text-lg">
                  {group.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Group Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-medium truncate text-white">{group.name}</h2>
                <p className="text-sm text-white/45 truncate">
                  {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-white/35">
            <div className="text-center">
              <FiUsers size={32} className="mx-auto mb-2 opacity-50" />
              <p>No groups yet</p>
              <button
                onClick={onCreateClick}
                className="mt-4 px-4 py-2 theme-button-primary rounded-full transition text-sm"
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
