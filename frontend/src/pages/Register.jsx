import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {  "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if(response.status === 201) {
        localStorage.setItem("token", data.token);

        navigate("/chat");
      } else {
        console.log(data.message);
      }
      
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input 
        value={username}
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username"
        />
        <input 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type='submit'>Register</button> 
      </form>
    </div>
  )
}

export default Register
