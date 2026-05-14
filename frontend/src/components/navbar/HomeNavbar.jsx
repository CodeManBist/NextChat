import React from "react";
import { FiMessageCircle } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const HomeNavbar = ({ isAuthenticated, username, onLogin, onRegister, onLogout }) => {
  return (
    <nav className="border-b border-white/8 bg-[#09090d]/70 px-4 sm:px-6 py-4 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-white/8 bg-white/3 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/4">
            <FiMessageCircle className="h-6 w-6 text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-semibold tracking-wide text-white sm:text-2xl">NextChat</h1>
            <p className="text-xs uppercase tracking-[0.35em] text-white/30">Realtime messaging</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-white/55 sm:inline">{username}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-linear-to-br from-[#1c1c22] to-[#2a2a33] shadow-[0_0_20px_rgba(0,0,0,0.25)]">
                <FaUserCircle className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
              </div>
              <button
                onClick={onLogout}
                className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/15 hover:bg-white/8 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="rounded-full px-4 py-2 text-sm font-medium text-white/60 transition hover:text-white"
              >
                Login
              </button>
              <button
                onClick={onRegister}
                className="rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.01] hover:bg-white/95"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;