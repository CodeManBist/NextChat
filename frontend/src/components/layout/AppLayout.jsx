import React from "react";
import TopNavbar from "../navbar/TopNavbar";
import SidebarLayout from "./SidebarLayout";

const AppLayout = ({
  children,
  activeMenu,
  setActiveMenu,
  selectedUser,
  setSelectedUser,
}) => {
  return (
    <div className="h-screen bg-[#07111B] flex flex-col overflow-hidden">

      {/* TOP NAVBAR */}
      <TopNavbar />

      {/* BOTTOM SECTION */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDEBAR */}
        <SidebarLayout
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />

        {/* RIGHT CONTENT */}
        <div className="flex-1 bg-[#07111B]">
          {children}
        </div>

      </div>

    </div>
  );
};

export default AppLayout;