import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE}/transactions`);
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/transactions/${id}`);
      setTransactions(transactions.filter(t => t.id !== id)); // update frontend
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Transactions</h1>
      <ul>
        {transactions.map((t) => (
          <li key={t.id} className="mb-2">
            {t.title} - ${t.amount}{" "}
            <button
              onClick={() => handleDelete(t.id)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
