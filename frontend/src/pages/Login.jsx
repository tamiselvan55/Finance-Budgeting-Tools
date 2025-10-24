import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      login(username); // pass username instead of email
      navigate("/dashboard");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 to-purple-900 p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">Login</h2>
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
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-medium"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-indigo-200 text-sm">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-purple-400 underline">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
