import React, { useEffect, useState } from "react";
import SidebarLayout from "./SidebarLayout";
import { HiMenu, HiX } from "react-icons/hi";

const AppLayout = ({
  children,
  activeMenu,
  setActiveMenu,
  selectedUser,
  setSelectedUser,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (
      window.innerWidth < 1024 &&
      activeMenu === "chats" &&
      !selectedUser
    ) {
      setSidebarOpen(true);
    }
  }, [activeMenu, selectedUser]);

  const showMobileHeader = !activeMenu;

  return (
    <div className="h-screen bg-[#07111B] flex flex-col lg:flex-row overflow-hidden">

      {/* MOBILE HEADER */}
      {showMobileHeader && (
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0D2038]">
          <h1 className="text-white text-xl font-bold">Chat</h1>
          <button
            onClick={toggleSidebar}
            className="text-white p-2 hover:bg-[#1a3a5c] rounded-lg transition"
          >
            {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      )}

      {/* SIDEBAR - RESPONSIVE */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 absolute lg:relative left-0 ${showMobileHeader ? "top-14 h-[calc(100vh-56px)]" : "top-0 h-screen"} lg:top-0 lg:h-screen w-full lg:w-80 transition-transform duration-300 z-40 lg:z-0`}
      >
        <SidebarLayout
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          onSelectUser={() => {
            if (window.innerWidth < 1024) {
              setSidebarOpen(false);
            }
          }}
        />
      </div>

      {/* OVERLAY FOR MOBILE */}
      {sidebarOpen && (
        <div
          className={`fixed lg:hidden inset-0 bg-black/50 z-30 ${showMobileHeader ? "top-14" : "top-0"}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-[#07111B] overflow-hidden">
        {children}
      </div>

    </div>
  );
};

export default AppLayout;