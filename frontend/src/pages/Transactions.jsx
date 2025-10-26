import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavDashboardButton from "../components/NavDashboardButton";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  // Load from localStorage when the page loads
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(saved);
  }, []);

  // Delete a transaction by index
  const deleteTransaction = (index) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 text-white p-6 relative">
      <NavDashboardButton />

      <div className="max-w-3xl mx-auto bg-white/10 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Transactions</h2>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-300">No transactions yet. Add one below!</p>
        ) : (
          <ul className="divide-y divide-gray-500/40">
            {transactions.map((tx, i) => (
              <li key={i} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    ₹{tx.amount} — {tx.category || "Uncategorized"}
                  </p>
                  <p className="text-sm text-gray-300">
                    {tx.description} • {tx.date ? tx.date.slice(0, 10) : "No date"}
                  </p>
                </div>
                <button
                  onClick={() => deleteTransaction(i)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="text-center mt-8">
          <Link
            to="/add-transaction"
            className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg font-semibold"
          >
            ➕ Add New Transaction
          </Link>
        </div>
      </div>
    </div>
  );
}
