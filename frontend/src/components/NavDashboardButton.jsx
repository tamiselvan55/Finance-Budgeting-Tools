import React from "react";
import { useNavigate } from "react-router-dom";

export default function NavDashboardButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/dashboard")}
      className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 transition text-white fixed top-4 right-4 z-50"
    >
      Dashboard
    </button>
  );
}