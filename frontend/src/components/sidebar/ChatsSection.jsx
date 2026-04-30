import React, { useState, useEffect, useContext } from "react";
import { FiSearch } from "react-icons/fi";
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
    <div className="flex flex-col h-full bg-[#0B141A] text-white">

      <div className="px-4 pb-4">

        {/* Search */}
        <div className="relative mt-4">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#202C33] text-white pl-12 pr-4 py-3 rounded-xl outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-4 px-4 py-4 cursor-pointer transition duration-200 ${
                selectedUser?._id === user._id
                  ? "bg-[#2A3942]"
                  : "hover:bg-[#202C33]"
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