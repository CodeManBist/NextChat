import React, { useState, useEffect, useContext } from "react";

import SearchInput from "../ui/SearchInput";
import { ChatContext } from "../../context/ChatContext";

const ChatsSection = ({ setSelectedUser, selectedUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { onlineUsers } = useContext(ChatContext);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

        const data = await response.json();

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getAllUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0F1E35] text-white">

      <div className="px-4 pb-4">

        {/* Search */}
        <div className="mt-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or start new chat"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-4 px-4 py-4 cursor-pointer transition duration-200 ${
                selectedUser?._id === user._id
                  ? "bg-[#1a3a5c]"
                  : "hover:bg-[#1a2f4a]"
              }`}
            >

              {/* Avatar */}
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />

                {/* Online/Offline Dot */}
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0B141A] rounded-full ${
                    onlineUsers.includes(user._id)
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">

                    <h2 className="font-medium truncate">
                      {currentUserId === user._id ? "You": user.username}
                    </h2>

                  <span className="text-xs text-gray-400">
                    12:45 PM
                  </span>
                </div>

                <p className="text-sm text-gray-400 truncate mt-1">
                  Click to start conversation
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsSection;