import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user, logout }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-800 text-white p-6 flex flex-col items-center">
      
      {/* Top Right — User Info + Logout */}
      <div className="w-full flex justify-end items-center mb-6 gap-4">
        <div className="text-white/80">
          Welcome
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Page Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-300">Quick access to your finance tools</p>
      </header>

      {/* Big Add Button */}
      <div className="relative mb-8 w-full max-w-sm">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-full p-10 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-2xl shadow-lg transition-transform transform hover:scale-105"
        >
          ➕ Add Income / Expense
        </button>

        {showMenu && (
          <div className="absolute top-full mt-2 w-full bg-white/20 backdrop-blur-lg rounded-xl shadow-lg flex flex-col">
            <button
              onClick={() => navigate("/add-transaction?type=income")}
              className="p-4 text-green-300 font-bold hover:bg-white/10 transition rounded-t-xl"
            >
              ➕ Add Income
            </button>
            <button
              onClick={() => navigate("/add-transaction?type=expense")}
              className="p-4 text-red-300 font-bold hover:bg-white/10 transition rounded-b-xl"
            >
              ➖ Add Expense
            </button>
          </div>
        )}
      </div>

      {/* Small Buttons */}
      <div className="flex gap-6 mb-12">
        <button
          onClick={() => navigate("/transactions")}
          className="px-6 py-3 rounded-xl bg-white/20 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
        >
          💰 View Transactions
        </button>

        <button
          onClick={() => navigate("/reports")}
          className="px-6 py-3 rounded-xl bg-white/20 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
        >
          📊 View Reports
        </button>
      </div>

      {/* Footer */}
      <footer className="text-gray-400 text-sm">
        Finance Dashboard © 2025
      </footer>
    </div>
  );
}
