import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      login(username); // After signup, treat as logged in
      navigate("/dashboard"); // navigate to dashboard
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-900 to-pink-700 p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-xl"
      >
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded-lg text-gray-900"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg text-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-medium"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-purple-200 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-400 underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
