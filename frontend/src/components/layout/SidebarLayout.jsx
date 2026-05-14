import React from "react";
import Sidebar from "../sidebar/Sidebar";

const SidebarLayout = ({
  activeMenu,
  setActiveMenu,
  selectedUser,
  setSelectedUser,
  onSelectUser,
}) => {

  return (
    <div className="theme-shell h-full w-full flex">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onSelectUser={onSelectUser}
      />
    </div>
  );
};

export default SidebarLayout;