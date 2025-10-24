import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-700 flex flex-col items-center justify-center text-white p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 drop-shadow-md">
          Personal Finance Budgeting Tool
        </h1>
        <p className="text-lg sm:text-xl text-indigo-200">
          Track your expenses, visualize spending, and stay in control
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link
          to="/login"
          className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-lg text-center"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-lg text-center"
        >
          Create Account
        </Link>
      </div>

      <div className="mt-10 text-center max-w-md text-sm sm:text-base text-indigo-200 leading-relaxed">
        Manage your income and expenses easily with smart dashboards and visual
        analytics — optimized for desktop and mobile.
      </div>

      <footer className="absolute bottom-4 text-sm text-indigo-300">
        © {new Date().getFullYear()} Finance Tracker • All Rights Reserved
      </footer>
    </div>
  );
};

export default Home;
