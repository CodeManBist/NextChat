import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiUsers, FiShield } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07111B] to-[#0a1929] flex flex-col">
      {/* NAVIGATION */}
      <nav className="bg-[#08141B] border-b border-[#1A2A33] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FiMessageCircle className="h-8 w-8 text-blue-400" />
            <h1 className="text-white text-2xl sm:text-3xl font-bold">NextChat</h1>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300 text-sm sm:text-base hidden sm:inline">
                  {username}
                </span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-400 flex items-center justify-center">
                  <FaUserCircle className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm sm:text-base transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 sm:px-4 py-2 text-gray-300 hover:text-white text-sm sm:text-base transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-16">
        <div className="max-w-4xl w-full text-center">
          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Connect Instantly
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
              Real-time messaging made simple. Connect with friends and family instantly with our modern chat platform.
            </p>
          </div>

          {/* CTA Button */}
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/chat")}
              className="mb-12 sm:mb-20 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-base sm:text-lg font-semibold transition transform hover:scale-105"
            >
              Open Chats
            </button>
          ) : (
            <button
              onClick={() => navigate("/register")}
              className="mb-12 sm:mb-20 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-base sm:text-lg font-semibold transition transform hover:scale-105"
            >
              Get Started
            </button>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-6 sm:p-8 bg-[#0f1e2e] border border-[#1A2A33] rounded-xl hover:border-blue-500 transition">
              <FiMessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Instant Messaging</h3>
              <p className="text-gray-400 text-sm sm:text-base">Send and receive messages in real-time with our fast and reliable platform.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 sm:p-8 bg-[#0f1e2e] border border-[#1A2A33] rounded-xl hover:border-blue-500 transition">
              <FiUsers className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Connect With Friends</h3>
              <p className="text-gray-400 text-sm sm:text-base">Build your network and stay connected with people who matter to you.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 sm:p-8 bg-[#0f1e2e] border border-[#1A2A33] rounded-xl hover:border-blue-500 transition sm:col-span-2 lg:col-span-1">
              <FiShield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-400 text-sm sm:text-base">Your messages are encrypted and your privacy is our top priority.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#08141B] border-t border-[#1A2A33] px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2026 NextChat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
