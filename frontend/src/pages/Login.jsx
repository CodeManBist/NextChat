import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthCard from "../components/auth/AuthCard";
import InputField from "../components/auth/InputField";
import PasswordInput from "../components/auth/PasswordInput";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);

        navigate("/");
      } else {
        console.log(data.message || "Login failed");
      }

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Login to continue your conversations"
      footerText="Don't have an account?"
      footerLinkText="Register"
      footerLink="/register"
    >
      <form onSubmit={handleLogin} className="space-y-5">

        <InputField
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-3 rounded-lg transition"
        >
          Login →
        </button>

      </form>
    </AuthCard>
  );
};

export default Login;