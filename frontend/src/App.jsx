import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import AddTransaction from "./pages/AddTransaction";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email) => {
    const newUser = { email };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const Protected = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Router>
      <div className="font-sans bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/signup" element={<Signup login={login} />} />

          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard user={user} logout={logout} />
              </Protected>
            }
          />
          <Route
            path="/transactions"
            element={
              <Protected>
                <Transactions user={user} logout={logout} />
              </Protected>
            }
          />
          <Route
            path="/reports"
            element={
              <Protected>
                <Reports user={user} logout={logout} />
              </Protected>
            }
          />
          <Route
            path="/add-transaction"
            element={
              <Protected>
                <AddTransaction user={user} logout={logout} />
              </Protected>
            }
          />

          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen text-2xl text-gray-600">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
