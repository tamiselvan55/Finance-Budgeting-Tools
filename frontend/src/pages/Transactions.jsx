import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import NavDashboardButton from "../components/NavDashboardButton";

export default function Transactions() {
  const [tx, setTx] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // --- Load from localStorage immediately ---
  useEffect(() => {
    const localData = localStorage.getItem("transactions");
    if (localData) {
      setTx(JSON.parse(localData));
    }
    fetchTransactions();
  }, []);

  // --- Fetch from backend and sync to localStorage ---
  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      const transactions = res.data.transactions || [];
      setTx(transactions);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      setMsg("✅ Synced with server");
    } catch (err) {
      setMsg("⚠️ Using offline data (server not reachable)");
    }
  };

  // --- Delete transaction (update backend + localStorage) ---
  const remove = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      const updated = tx.filter((t) => t._id !== id);
      setTx(updated);
      localStorage.setItem("transactions", JSON.stringify(updated));
      setMsg("✅ Transaction deleted");
    } catch (err) {
      setMsg("⚠️ Delete failed, check your connection");
    }
  };

  // --- Add a new transaction locally (temporary for offline use) ---
  const addOfflineTransaction = (newTx) => {
    const updated = [...tx, newTx];
    setTx(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
    setMsg("📝 Added offline (will sync when online)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 text-white p-6 relative">
      <NavDashboardButton />

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Transactions</h2>

        {msg && <div className="mb-3 p-2 bg-indigo-700 rounded text-center">{msg}</div>}

        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => navigate("/add-transaction?type=income")}
            className="bg-gradient-to-br from-purple-800 to-purple-400 text-white px-6 py-3 rounded-lg hover:opacity-90 transition font-semibold shadow"
          >
            Add Income
          </button>
          <button
            onClick={() => navigate("/add-transaction?type=expense")}
            className="bg-gradient-to-br from-pink-800 to-purple-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition font-semibold shadow"
          >
            Add Expense
          </button>
        </div>

        <div className="space-y-3">
          {tx.length === 0 ? (
            <p className="text-gray-300 text-center">No transactions yet.</p>
          ) : (
            tx.map((t) => (
              <div
                key={t._id || t.tempId}
                className="bg-white/10 p-4 rounded flex justify-between items-start shadow-md hover:bg-white/20 transition"
              >
                <div>
                  <div className="font-semibold text-lg">
                    {t.category} •{" "}
                    <span className="text-sm text-gray-300">
                      {new Date(t.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200">{t.description}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold text-lg ${
                      t.type === "income" ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    ₹{Number(t.amount).toFixed(2)}
                  </div>
                  <button
                    onClick={() => remove(t._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mt-2 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
