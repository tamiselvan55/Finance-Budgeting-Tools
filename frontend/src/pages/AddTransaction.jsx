import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/api";
import NavDashboardButton from "../components/NavDashboardButton";

export default function AddTransaction() {
  const navigate = useNavigate();
  const location = useLocation();
  const type = new URLSearchParams(location.search).get("type") || "income";

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
    type: type,
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTx = { ...form, amount: Number(form.amount), date: form.date || new Date() };

    try {
      // --- Try sending to backend ---
      const res = await API.post("/transactions", newTx);
      const savedTx = res.data.transaction;

      // --- Update localStorage ---
      const localData = JSON.parse(localStorage.getItem("transactions")) || [];
      const updated = [...localData, savedTx];
      localStorage.setItem("transactions", JSON.stringify(updated));

      setMsg("✅ Transaction added successfully!");
      setTimeout(() => navigate("/transactions"), 1000);
    } catch (err) {
      // --- Offline fallback ---
      const localData = JSON.parse(localStorage.getItem("transactions")) || [];
      const tempTx = { ...newTx, tempId: Date.now(), offline: true };
      const updated = [...localData, tempTx];
      localStorage.setItem("transactions", JSON.stringify(updated));

      setMsg("📝 Saved offline. Will sync later.");
      setTimeout(() => navigate("/transactions"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 text-white p-6 relative">
      <NavDashboardButton />

      <div className="max-w-md mx-auto bg-white/10 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Add {type === "income" ? "Income" : "Expense"}
        </h2>

        {msg && <div className="mb-4 p-3 bg-indigo-700 rounded text-center">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            required
            className="w-full p-3 rounded text-black"
          />

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className="w-full p-3 rounded text-black"
          />

          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 rounded text-black"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-3 rounded text-black"
          />

          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold"
          >
            Add {type === "income" ? "Income" : "Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
