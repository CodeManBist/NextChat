import React, { useContext, useEffect, useMemo, useState } from "react";
import { GroupContext } from "../../context/GroupContext";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";
import SearchInput from "../ui/SearchInput";

const GroupMembers = ({ onClose }) => {
  const {
    currentGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    promoteGroupAdmin,
    updateGroupName,
    leaveGroup,
    deleteGroup,
  } = useContext(GroupContext);

  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showRenameForm, setShowRenameForm] = useState(false);
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [groupActionLoading, setGroupActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const isAdmin = Boolean(currentGroup && currentGroup.admin?._id === currentUserId);
  const memberIds = useMemo(
    () => new Set((currentGroup?.members || []).map((member) => member._id)),
    [currentGroup]
  );

  useEffect(() => {
    if (!currentGroup || !isAdmin || !showAddMembers) {
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setErrorMessage("");

        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load users");
        }

        const data = await response.json();
        const eligibleUsers = data.filter(
          (user) => user._id !== currentUserId && !memberIds.has(user._id)
        );

        setAvailableUsers(eligibleUsers);
      } catch (error) {
        setErrorMessage(error.message || "Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [currentUserId, currentGroup, isAdmin, memberIds, showAddMembers, token]);

  if (!currentGroup) return null;

  const filteredAvailableUsers = availableUsers.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMember = async (memberId) => {
    if (!currentGroup?._id) return;

    try {
      setActionLoadingId(memberId);
      setErrorMessage("");
      setSuccessMessage("");

      await addMemberToGroup(currentGroup._id, memberId);
      setAvailableUsers((prev) => prev.filter((user) => user._id !== memberId));
      setSuccessMessage("Member added successfully");
    } catch (error) {
      setErrorMessage(error.message || "Failed to add member");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!currentGroup?._id) return;

    try {
      setActionLoadingId(memberId);
      setErrorMessage("");
      setSuccessMessage("");

      await removeMemberFromGroup(currentGroup._id, memberId);
      setAvailableUsers((prev) => prev.filter((user) => user._id !== memberId));
      setSuccessMessage("Member removed successfully");
    } catch (error) {
      setErrorMessage(error.message || "Failed to remove member");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMakeAdmin = async (memberId) => {
    if (!currentGroup?._id) return;

    try {
      setActionLoadingId(memberId);
      setErrorMessage("");
      setSuccessMessage("");

      await promoteGroupAdmin(currentGroup._id, memberId);
      setSuccessMessage("Admin updated successfully");
    } catch (error) {
      setErrorMessage(error.message || "Failed to transfer admin");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRenameGroup = async () => {
    if (!currentGroup?._id || !groupName.trim()) {
      setErrorMessage("Group name is required");
      return;
    }

    try {
      setGroupActionLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await updateGroupName(currentGroup._id, groupName.trim());
      setSuccessMessage("Group name updated successfully");
      setShowRenameForm(false);
    } catch (error) {
      setErrorMessage(error.message || "Failed to update group name");
    } finally {
      setGroupActionLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentGroup?._id) return;

    try {
      setGroupActionLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await leaveGroup(currentGroup._id);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || "Failed to leave group");
    } finally {
      setGroupActionLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!currentGroup?._id) return;

    try {
      setGroupActionLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await deleteGroup(currentGroup._id);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete group");
    } finally {
      setGroupActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1E35] rounded-xl border border-[#1A3A5C] max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1A3A5C] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Members</h2>
            <p className="text-xs text-gray-400 mt-1">
              {currentGroup.members?.length || 0} member{currentGroup.members?.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1a3a5c] rounded-lg transition text-gray-400"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-300 text-sm">
              {successMessage}
            </div>
          )}

          <div className="space-y-3">
            {currentGroup.members.map((member) => {
              const isSelf = member._id === currentUserId;
              const isGroupAdmin = currentGroup.admin?._id === member._id;

              return (
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
                      <p className="text-white truncate font-medium">
                        {isSelf ? "You" : member.username}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {isGroupAdmin && (
                          <p className="text-xs text-blue-400">Admin</p>
                        )}
                        {isSelf && (
                          <p className="text-xs text-gray-400">You</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {isAdmin && !isSelf && !isGroupAdmin && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleMakeAdmin(member._id)}
                        disabled={actionLoadingId === member._id}
                        className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 transition hover:bg-blue-500/20 disabled:opacity-50"
                      >
                        {actionLoadingId === member._id ? "Making..." : "Make admin"}
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        disabled={actionLoadingId === member._id}
                        className="p-1 hover:bg-red-500/20 text-red-400 rounded-lg transition disabled:opacity-50"
                        aria-label={`Remove ${member.username}`}
                      >
                        {actionLoadingId === member._id ? (
                          <span className="inline-block h-4.5 w-4.5 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                        ) : (
                          <FiX size={18} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isAdmin && (
            <div className="border border-[#1A3A5C] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setGroupName(currentGroup?.name || "");
                  setShowRenameForm((prev) => !prev);
                  setShowAddMembers(false);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#0D2038] hover:bg-[#112742] text-left transition"
              >
                <span className="text-white font-medium">Rename group</span>
                <span className="text-xs text-gray-400">
                  {showRenameForm ? "Hide" : "Show"}
                </span>
              </button>

              {showRenameForm && (
                <div className="p-4 space-y-3 bg-[#0B182B]">
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full rounded-lg border border-[#1A3A5C] bg-[#0D2038] px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                    placeholder="Enter new group name"
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRenameForm(false)}
                      className="flex-1 rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRenameGroup}
                      disabled={groupActionLoading || !groupName.trim()}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      {groupActionLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="border border-[#1A3A5C] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setShowAddMembers((prev) => !prev);
                  setSearch("");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#0D2038] hover:bg-[#112742] text-left transition"
              >
                <span className="flex items-center gap-2 text-white font-medium">
                  <FiPlus size={18} />
                  Add member
                </span>
                <span className="text-xs text-gray-400">
                  {showAddMembers ? "Hide" : "Show"}
                </span>
              </button>

              {showAddMembers && (
                <div className="p-4 space-y-3 bg-[#0B182B]">
                  <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users"
                  />

                  <div className="max-h-56 overflow-y-auto space-y-2 chat-scrollbar pr-1">
                    {loadingUsers ? (
                      <div className="py-8 text-center text-sm text-gray-400">
                        Loading users...
                      </div>
                    ) : filteredAvailableUsers.length > 0 ? (
                      filteredAvailableUsers.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between gap-3 rounded-lg bg-[#0D2038] px-3 py-2.5"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
                              alt={user.username}
                              className="w-9 h-9 rounded-full shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-white truncate">
                                {user.username}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddMember(user._id)}
                            disabled={actionLoadingId === user._id}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                          >
                            {actionLoadingId === user._id ? (
                              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <FiCheck size={14} />
                            )}
                            Add
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-sm text-gray-400">
                        {search ? "No users match your search" : "No available users to add"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleLeaveGroup}
              disabled={groupActionLoading}
              className="w-full rounded-xl border border-[#1A3A5C] bg-[#0D2038] px-4 py-3 text-left transition hover:bg-[#112742] disabled:opacity-50"
            >
              <span className="block text-sm font-medium text-white">Leave group</span>
              <span className="block text-xs text-gray-400 mt-1">
                You will be removed from this group
              </span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={handleDeleteGroup}
                disabled={groupActionLoading}
                className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-left transition hover:bg-red-500/20 disabled:opacity-50"
              >
                <span className="block text-sm font-medium text-red-300">Delete group</span>
                <span className="block text-xs text-red-200/70 mt-1">
                  Permanently delete the group and its messages
                </span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GroupMembers;
