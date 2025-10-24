import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import NavDashboardButton from "../components/NavDashboardButton";

export default function AddTransaction() {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, amount: parseFloat(form.amount), date: form.date || new Date() };
      await API.post("/transactions", payload);
      setMsg("✅ Transaction saved successfully!");
      setTimeout(() => navigate("/transactions"), 900);
    } catch (err) {
      setMsg(err?.response?.data?.message || "❌ Save failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 p-4 relative">
      {/* Dashboard button in top-right corner */}
      <div className="absolute top-4 right-4">
        <NavDashboardButton />
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">💰 Add Transaction</h2>

        {msg && (
          <div className="mb-4 p-3 text-center bg-indigo-800 rounded-lg text-sm font-semibold">
            {msg}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <select
            name="type"
            value={form.type}
            onChange={change}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="expense" className="text-black">
              Expense
            </option>
            <option value="income" className="text-black">
              Income
            </option>
          </select>

          <input
            name="amount"
            value={form.amount}
            onChange={change}
            type="number"
            step="0.01"
            placeholder="Enter amount"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />

          <input
            name="category"
            value={form.category}
            onChange={change}
            placeholder="Category (e.g., Food, Rent)"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />

          <input
            name="date"
            value={form.date}
            onChange={change}
            type="date"
            className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={change}
            placeholder="Description (optional)"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 transition-all duration-300"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
