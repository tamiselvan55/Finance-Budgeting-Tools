import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
  const [tx, setTx] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTx(res.data.transactions || []);
    } catch (err) {
      setMsg("Unable to fetch transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Delete transaction
  const remove = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTx((prev) => prev.filter((t) => t._id !== id)); // remove from UI
      setMsg("Transaction deleted successfully");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg("Delete failed");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Transactions</h2>

        {msg && (
          <div className="mb-4 p-3 bg-indigo-700 rounded-lg text-center font-medium">
            {msg}
          </div>
        )}

        {/* Add Transaction Buttons */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => navigate("/add-transaction?type=income")}
            className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold"
          >
            + Add Income
          </button>
          <button
            onClick={() => navigate("/add-transaction?type=expense")}
            className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg font-semibold"
          >
            + Add Expense
          </button>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {tx.length === 0 ? (
            <p className="text-gray-300 text-center">No transactions yet.</p>
          ) : (
            tx.map((t) => (
              <div
                key={t._id}
                className="bg-white/10 p-4 rounded-xl flex justify-between items-start shadow-md hover:bg-white/20 transition"
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
                    className="bg-red-700 hover:bg-red-600 px-4 py-2 mt-2 rounded-lg font-medium"
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
