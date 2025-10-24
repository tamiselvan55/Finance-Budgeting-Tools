import React from "react";
import { Link } from "react-router-dom";

export default function Header(){
  return (
    <header className="flex items-center justify-between px-6 py-6">
      <div className="text-xl font-bold">Personal Finance Budgeting Tool</div>
      <nav className="space-x-3">
        <Link to="/" className="px-4 py-2 rounded-full bg-white/8 hover:bg-white/12">Home</Link>
        <Link to="/add" className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500">Add Transaction</Link>
        <Link to="/transactions" className="px-4 py-2 rounded-full border border-white/20">View Transactions</Link>
      </nav>
    </header>
  );
}
