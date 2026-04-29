import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";

const SidebarLayout = ({
  activeMenu,
  setActiveMenu,
  selectedUser,
  setSelectedUser,
}) => {

  return (
    <div className="flex h-screen bg-[#07141B]">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
};

export default SidebarLayout;