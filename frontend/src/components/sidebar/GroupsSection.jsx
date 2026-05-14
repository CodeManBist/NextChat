import React, { useState, useContext, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { GroupContext } from "../../context/GroupContext";
import SearchInput from "../ui/SearchInput";
import CreateGroupModal from "../groups/CreateGroupModal";

const GroupsSection = ({ selectedGroup, setSelectedGroup, onSelectGroup }) => {
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { groups, fetchUserGroups, setCurrentGroup } = useContext(GroupContext);

  // Fetch groups on mount
  useEffect(() => {
    fetchUserGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  // Get group display info
  const getMemberCount = (group) => {
    return group.members?.length || 0;
  };

  const getGroupInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "G";
  };

  return (
    <div className="flex flex-col h-full theme-panel text-white">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups"
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="shrink-0 p-2 hover:bg-white/6 rounded-xl transition text-white/60 hover:text-white"
            title="Create new group"
          >
            <FiPlus size={20} />
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <div
              key={group._id}
              onClick={() => {
                setSelectedGroup(group);
                setCurrentGroup(group);  // Update GroupContext
                onSelectGroup?.();
              }}
              className={`flex items-center gap-4 px-4 py-4 cursor-pointer transition duration-200 ${
                selectedGroup?._id === group._id
                  ? "bg-white/8"
                  : "hover:bg-white/4"
              }`}
            >
              {/* Group Avatar */}
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#1c1c22] to-[#2e2935] border border-white/10 flex items-center justify-center text-white font-semibold text-lg">
                  {getGroupInitial(group.name)}
                </div>
              </div>

              {/* Group Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium truncate">{group.name}</h2>
                  <span className="text-xs text-white/35">
                    {getMemberCount(group)} members
                  </span>
                </div>

                <p className="text-sm text-white/45 truncate mt-1">
                  {group.members?.length === 1
                    ? "Only you"
                    : `${group.members?.length || 1} members`}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center flex-col gap-4">
            <div className="text-white/35 text-center">
              {search ? "No groups found" : "No groups yet"}
            </div>
            {!search && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-black transition hover:bg-white/95"
              >
                <FiPlus size={18} />
                Create Group
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default GroupsSection;
