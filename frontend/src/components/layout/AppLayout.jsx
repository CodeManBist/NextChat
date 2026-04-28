import React from "react";
import TopNavbar from "../navbar/TopNavbar";
import Sidebar from "../sidebar/Sidebar";

const AppLayout = ({ children }) => {
  return (
    <div className="h-screen bg-[#07111B] flex flex-col overflow-hidden">

      {/* TOP NAVBAR */}
      <TopNavbar />

      {/* BOTTOM SECTION */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* RIGHT CONTENT */}
        <div className="flex-1 bg-[#07111B]">
          {children}
        </div>

      </div>

    </div>
  );
};

export default AppLayout;