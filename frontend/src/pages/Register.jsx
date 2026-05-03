import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthCard from "../components/auth/AuthCard";
import InputField from "../components/auth/InputField";
import PasswordInput from "../components/auth/PasswordInput";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);

        navigate("/");
      } else {
        setErrorMessage(data.message || "Registration failed");
      }

    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Something went wrong.");
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Start chatting securely"
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLink="/login"
    >
      <form onSubmit={handleRegister} className="space-y-5">

        <InputField
          label="Username"
          placeholder="John Doe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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
          Register →
        </button>

      </form>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
      )}
    </AuthCard>
  );
};

export default Register;