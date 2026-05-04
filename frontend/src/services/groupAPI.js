const API_BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const groupAPI = {
  // Create a new group
  createGroup: async (name, memberIds) => {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ name, memberIds }),
    });

    if (!response.ok) throw new Error("Failed to create group");
    return await response.json();
  },

  // Get all groups for current user
  getUserGroups: async () => {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      headers: headers(),
    });

    if (!response.ok) throw new Error("Failed to fetch groups");
    return await response.json();
  },

  // Get single group details
  getGroupDetails: async (groupId) => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      headers: headers(),
    });

    if (!response.ok) throw new Error("Failed to fetch group");
    return await response.json();
  },

  // Get group messages
  getGroupMessages: async (groupId, page = 1, limit = 50) => {
    const response = await fetch(
      `${API_BASE_URL}/groups/${groupId}/messages?page=${page}&limit=${limit}`,
      {
        headers: headers(),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch messages");
    return await response.json();
  },

  // Add member to group
  addMemberToGroup: async (groupId, memberId) => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ memberId }),
    });

    if (!response.ok) throw new Error("Failed to add member");
    return await response.json();
  },

  // Remove member from group
  removeMemberFromGroup: async (groupId, memberId) => {
    const response = await fetch(
      `${API_BASE_URL}/groups/${groupId}/members/${memberId}`,
      {
        method: "DELETE",
        headers: headers(),
      }
    );

    if (!response.ok) throw new Error("Failed to remove member");
    return await response.json();
  },

  // Update group
  updateGroup: async (groupId, name) => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error("Failed to update group");
    return await response.json();
  },

  // Delete group
  deleteGroup: async (groupId) => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: "DELETE",
      headers: headers(),
    });

    if (!response.ok) throw new Error("Failed to delete group");
    return await response.json();
  },

  // Leave group
  leaveGroup: async (groupId) => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/leave`, {
      method: "POST",
      headers: headers(),
    });

    if (!response.ok) throw new Error("Failed to leave group");
    return await response.json();
  },
};

export default groupAPI;
