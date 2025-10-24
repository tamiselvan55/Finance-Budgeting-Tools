import React, { useEffect, useState } from "react";
import API from "../utils/api";
import NavDashboardButton from "../components/NavDashboardButton";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
  const [tx, setTx] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate(); // hook to navigate

  const fetch = async () => {
    try {
      const res = await API.get("/transactions");
      setTx(res.data.transactions || []);
    } catch (err) {
      setMsg("Unable to fetch");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const remove = async (id) => {
    try {
      await API.delete('/transactions/${id}');
      setTx(tx.filter((t) => t._id !== id));
    } catch (err) {
      setMsg("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Transactions</h2>

        {msg && <div className="mb-3 p-2 bg-indigo-700 rounded text-center">{msg}</div>}

        {/* Navigate to Add Transaction Page */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => navigate("/add-transaction?type=income")}
            className="min-h-screenbg-gradient-to-brfrom-purple-800 to-purple-400 text-white p-6"
            >
            <b>Add Income</b>
          </button>
          <button
            onClick={() => navigate("/add-transaction?type=expense")}
            className="min-h-screenbg-gradient-to-brfrom-purple-800 to-purple-400 text-white p-6"
          >
            <b>Add Expense</b>
          </button>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {tx.length === 0 && <p className="text-gray-300 text-center">No transactions yet.</p>}
          {tx.map((t) => (
            <div
              key={t._id}
              className="bg-white/10 p-4 rounded flex justify-between items-start shadow-md"
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
                  className="min-h-screenbg-gradient-to-brfrom-purple-800top-0right-0p-6text-whitep-2mt-2bg-red-600hover:bg-red-700rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}