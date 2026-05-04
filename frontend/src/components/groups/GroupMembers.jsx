import React, { useContext } from "react";
import { GroupContext } from "../../context/GroupContext";
import { FiX, FiPlus } from "react-icons/fi";

const GroupMembers = ({ onAddMemberClick, onClose }) => {
  const { currentGroup } = useContext(GroupContext);
  const currentUserId = localStorage.getItem("userId");

  if (!currentGroup) return null;

  const isAdmin = currentGroup.admin?._id === currentUserId;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1E35] rounded-xl border border-[#1A3A5C] max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1A3A5C] flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Members</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1a3a5c] rounded-lg transition text-gray-400"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentGroup.members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-3 bg-[#0D2038] rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${member.username}&background=0D8ABC&color=fff`}
                  alt={member.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate font-medium">{member.username}</p>
                  {currentGroup.admin?._id === member._id && (
                    <p className="text-xs text-blue-400">Admin</p>
                  )}
                </div>
              </div>

              {isAdmin && currentGroup.admin?._id !== member._id && (
                <button
                  onClick={() => {
                    // Handle remove member
                    console.log("Remove member:", member._id);
                  }}
                  className="p-1 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Member Button */}
        {isAdmin && (
          <div className="border-t border-[#1A3A5C] p-4">
            <button
              onClick={onAddMemberClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
            >
              <FiPlus size={18} />
              Add Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupMembers;
