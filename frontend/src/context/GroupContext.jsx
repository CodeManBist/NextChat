import React, { createContext, useEffect, useState } from "react";
import socket from "../socket";

export const GroupContext = createContext({
  groups: [],
  currentGroup: null,
  groupMessages: [],
  groupMembers: [],
  loading: false,
  error: null,
  setCurrentGroup: () => {},
  setGroupMessages: () => {},
  fetchUserGroups: () => {},
  createNewGroup: () => {},
  fetchGroupMessages: () => {},
});

const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch all groups for current user
  const fetchUserGroups = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch groups");

      const data = await response.json();
      setGroups(data);

      // Join all groups via socket
      const groupIds = data.map(g => g._id);
      socket.emit("joinGroups", groupIds);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific group
  const fetchGroupMessages = async (groupId, page = 1) => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}/messages?page=${page}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setGroupMessages(data.messages);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching group messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new group
  const createNewGroup = async (name, memberIds) => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, memberIds }),
      });

      if (!response.ok) throw new Error("Failed to create group");

      const data = await response.json();
      setGroups([...groups, data.group]);
      setCurrentGroup(data.group);
      socket.emit("joinGroups", [data.group._id]);
      return data.group;
    } catch (err) {
      setError(err.message);
      console.error("Error creating group:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add member to group
  const addMemberToGroup = async (groupId, memberId) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memberId }),
      });

      if (!response.ok) throw new Error("Failed to add member");

      const data = await response.json();
      setGroups(groups.map(g => g._id === groupId ? data.group : g));
      if (currentGroup?._id === groupId) {
        setCurrentGroup(data.group);
      }
      return data.group;
    } catch (err) {
      setError(err.message);
      console.error("Error adding member:", err);
    }
  };

  // Remove member from group
  const removeMemberFromGroup = async (groupId, memberId) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}/members/${memberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to remove member");

      const data = await response.json();
      setGroups(groups.map(g => g._id === groupId ? data.group : g));
      if (currentGroup?._id === groupId) {
        setCurrentGroup(data.group);
      }
      return data.group;
    } catch (err) {
      setError(err.message);
      console.error("Error removing member:", err);
    }
  };

  // Update group
  const updateGroupName = async (groupId, name) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to update group");

      const data = await response.json();
      setGroups(groups.map(g => g._id === groupId ? data.group : g));
      if (currentGroup?._id === groupId) {
        setCurrentGroup(data.group);
      }
      return data.group;
    } catch (err) {
      setError(err.message);
      console.error("Error updating group:", err);
    }
  };

  // Delete group
  const deleteGroup = async (groupId) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete group");

      setGroups(groups.filter(g => g._id !== groupId));
      if (currentGroup?._id === groupId) {
        setCurrentGroup(null);
        setGroupMessages([]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error deleting group:", err);
    }
  };

  // Leave group
  const leaveGroup = async (groupId) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to leave group");

      setGroups(groups.filter(g => g._id !== groupId));
      if (currentGroup?._id === groupId) {
        setCurrentGroup(null);
        setGroupMessages([]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error leaving group:", err);
    }
  };

  // Load groups on mount
  useEffect(() => {
    if (token) {
      fetchUserGroups();
    }
  }, [token]);

  // Listen for new group messages
  useEffect(() => {
    const handleReceiveGroupMessage = (message) => {
      if (message.groupId === currentGroup?._id) {
        setGroupMessages(prev => [...prev, message]);
      }
    };

    socket.on("receiveGroupMessage", handleReceiveGroupMessage);

    return () => {
      socket.off("receiveGroupMessage", handleReceiveGroupMessage);
    };
  }, [currentGroup]);

  const value = {
    groups,
    currentGroup,
    groupMessages,
    loading,
    error,
    setCurrentGroup,
    setGroupMessages,
    fetchUserGroups,
    fetchGroupMessages,
    createNewGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    updateGroupName,
    deleteGroup,
    leaveGroup,
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
