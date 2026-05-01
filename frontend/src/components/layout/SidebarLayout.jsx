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
    <div className="h-full w-full bg-[#07141B] flex">
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