import React from "react";
import { useNavigate } from "react-router-dom";
import Hyperspeed from "../components/Hyperspeed";
import HomeNavbar from "../components/navbar/HomeNavbar";
import { hyperspeedPresets } from "../components/hyperspeedPresets";

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    // Call server to clear cookie (if any) and then clear client state.
    fetch("http://localhost:5000/api/users/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/login");
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", backgroundColor: "#000000" }}>
      <div className="absolute inset-0 z-1 pointer-events-none bg-linear-to-b from-black/85 via-black/45 to-black/92" />
      <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(circle_at_22%_24%,rgba(216,86,191,0.10),transparent_30%),radial-gradient(circle_at_78%_70%,rgba(3,179,195,0.10),transparent_34%)]" />
      <div className="absolute top-0 left-0 right-0 z-10">
        <HomeNavbar
          isAuthenticated={isAuthenticated}
          username={username}
          onLogin={() => navigate("/login")}
          onRegister={() => navigate("/register")}
          onLogout={handleLogout}
        />
      </div>
      <main className="absolute inset-0 z-10 flex items-center justify-center px-4 pt-20 pb-24">
        <section className="w-full max-w-4xl text-center">

          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Click and hold to see the real magic of hyperspeed.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
            Premium motion, fast conversations, and a dark interface tuned to feel smooth instead of heavy.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => (isAuthenticated ? navigate("/chat") : navigate("/register"))}
              className="min-w-37.5 rounded-2xl bg-white px-7 py-3.5 text-base font-semibold text-black shadow-[0_14px_30px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] hover:bg-white/95"
            >
              {isAuthenticated ? "Open Chats" : "Get started"}
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="min-w-37.5 rounded-2xl border border-white/10 bg-[#121219]/80 px-7 py-3.5 text-base font-medium text-white/70 shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:border-white/15 hover:bg-[#17171f]/90 hover:text-white"
            >
              Learn more
            </button>
          </div>
        </section>
      </main>
      <Hyperspeed
        effectOptions={hyperspeedPresets.one}
      />
      <footer className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/8 bg-[#09090d]/72 backdrop-blur-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-[0_-10px_35px_rgba(0,0,0,0.22)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-3xl border border-white/8 bg-white/3 px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p className="text-white/65">&copy; 2026 NextChat.</p>
          <p className="text-white/35">Built for real-time conversations.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
