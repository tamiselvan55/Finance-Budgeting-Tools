import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing users from localStorage or start empty
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if username already exists
    if (users.find((u) => u.username === username)) {
      alert("Username already taken");
      return;
    }

    // Add new user
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    // Log in immediately
    login(username);
    navigate("/dashboard");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
