import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavDashboardButton from "../components/NavDashboardButton";

export default function AddTransaction() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
    type: "income",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTx = {
      ...form,
      id: Date.now(),
      amount: Number(form.amount),
      date: form.date || new Date().toISOString().slice(0, 10),
    };

    const existing = JSON.parse(localStorage.getItem("transactions")) || [];
    const updated = [...existing, newTx];
    localStorage.setItem("transactions", JSON.stringify(updated));

    setMsg("✅ Transaction added!");
    setTimeout(() => navigate("/transactions"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 text-white p-6 relative">
      <NavDashboardButton />

      <div className="max-w-md mx-auto bg-white/10 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Add Transaction</h2>

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

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-3 rounded text-black"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
