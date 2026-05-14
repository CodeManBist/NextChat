import React, { useState, useContext, useEffect } from "react";
import { GroupContext } from "../../context/GroupContext";
import { FiX, FiCheck } from "react-icons/fi";

const CreateGroupModal = ({ onClose }) => {
  const { createNewGroup } = useContext(GroupContext);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // Filter out current user
        setAllUsers(data.filter(u => u._id !== currentUserId));
      } catch {
        setError("Failed to load users");
      }
    };

    fetchUsers();
  }, [token, currentUserId]);

  const handleToggleMember = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    if (selectedMembers.length === 0) {
      setError("Select at least one member");
      return;
    }

    setLoading(true);
    try {
      await createNewGroup(groupName, selectedMembers);
      onClose();
    } catch {
      setError("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="theme-panel-strong rounded-[28px] max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Create Group</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/6 rounded-xl transition text-white/45"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="theme-input w-full px-4 py-3 rounded-2xl"
            />
          </div>

          {/* Members Selection */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Select Members ({selectedMembers.length})
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleToggleMember(user._id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition border ${
                    selectedMembers.includes(user._id)
                      ? "bg-white/8 border-white/10"
                      : "bg-white/3 border-transparent hover:border-white/8"
                  }`}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate font-medium">{user.username}</p>
                    <p className="text-xs text-white/40 truncate">{user.email}</p>
                  </div>

                  {selectedMembers.includes(user._id) && (
                    <FiCheck size={20} className="text-white shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-2xl text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 theme-button-secondary rounded-2xl transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={loading}
            className="flex-1 px-4 py-3 theme-button-primary rounded-2xl transition font-medium disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
