// frontend/src/pages/Reports.jsx
import React, { useEffect, useState, useMemo } from "react";
import API from "../utils/api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut, Line } from "react-chartjs-2";
import NavDashboardButton from "../components/NavDashboardButton";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartDataLabels
);

function formatCurrency(num) {
  if (num == null) return "₹0.00";
  return `₹${Number(num).toFixed(2)}`;
}

function downloadFile(content, filename, mime = "text/csv") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCSV(rows) {
  if (!rows.length) return "";
  const header = Object.keys(rows[0]);
  const csv = [
    header.join(","),
    ...rows.map((r) =>
      header
        .map((h) => {
          const v = r[h] == null ? "" : String(r[h]);
          return `"${v.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");
  return csv;
}

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, breakdown: [] });
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ from: "", to: "" });
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [transactions, range]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, sumRes] = await Promise.all([
        API.get("/transactions"),
        API.get("/transactions/summary/all"),
      ]);
      setTransactions(txRes.data.transactions || []);
      setSummary(sumRes.data || { income: 0, expense: 0, balance: 0, breakdown: [] });
    } catch (err) {
      console.error("Reports fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  function applyFilter() {
    if (!range.from && !range.to) {
      setFiltered(transactions);
      return;
    }
    const from = range.from ? new Date(range.from) : null;
    const to = range.to ? new Date(range.to + "T23:59:59.999") : null;
    setFiltered(
      transactions.filter((t) => {
        const d = new Date(t.date);
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      })
    );
  }

  const categoryData = useMemo(() => {
    const map = {};
    for (const t of filtered) {
      const key = `${t.category} (${t.type})`;
      map[key] = (map[key] || 0) + Number(t.amount || 0);
    }
    return {
      labels: Object.keys(map),
      values: Object.values(map),
    };
  }, [filtered]);

  const monthlyTrend = useMemo(() => {
    const map = {};
    for (const t of filtered) {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const amt = Number(t.amount || 0) * (t.type === "expense" ? -1 : 1);
      map[key] = (map[key] || 0) + amt;
    }
    const keys = Object.keys(map).sort();
    return {
      labels: keys,
      values: keys.map((k) => map[k]),
    };
  }, [filtered]);

  const handleExportCSV = () => {
    const rows = filtered.map((t) => ({
      id: t._id,
      type: t.type,
      amount: t.amount,
      category: t.category,
      description: t.description || "",
      date: new Date(t.date).toISOString(),
    }));
    const csv = toCSV(rows);
    downloadFile(csv, "transactions_report.csv", "text/csv");
  };

  const handleExportJSON = () => {
    downloadFile(JSON.stringify(filtered, null, 2), "transactions_report.json", "application/json");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white text-lg font-bold">
        Loading reports...
      </div>
    );
  }

  // Assign colors for doughnut slices
  const COLORS = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#C9CBCF", "#7B68EE"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white p-4 relative">
      <div className="absolute top-4 right-4">
        <NavDashboardButton />
      </div>

      <header className="text-center mb-10 mt-8">
        <h1 className="text-4xl font-bold mb-2">📊 Financial Reports</h1>
        <p className="text-white/80 font-bold">Track income, expenses, and financial trends</p>
      </header>

      {/* Summary Cards */}
      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl text-center shadow-lg font-bold">
          <div className="text-sm text-white/70">Total Income</div>
          <div className="text-3xl font-bold text-green-300">{formatCurrency(summary.income)}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl text-center shadow-lg font-bold">
          <div className="text-sm text-white/70">Total Expenses</div>
          <div className="text-3xl font-bold text-red-300">{formatCurrency(summary.expense)}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl text-center shadow-lg font-bold">
          <div className="text-sm text-white/70">Balance</div>
          <div className="text-3xl font-bold text-yellow-300">{formatCurrency(summary.balance)}</div>
        </div>
      </section>

      {/* Filter + Export */}
      <section className="bg-white/10 backdrop-blur-md p-5 rounded-2xl mb-8 shadow-lg font-bold">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-white/80">From</label>
            <input
              type="date"
              value={range.from}
              onChange={(e) => setRange({ ...range, from: e.target.value })}
              className="p-2 rounded-lg bg-white/20 text-white focus:outline-none font-bold"
            />
            <label className="text-sm text-white/80">To</label>
            <input
              type="date"
              value={range.to}
              onChange={(e) => setRange({ ...range, to: e.target.value })}
              className="p-2 rounded-lg bg-white/20 text-white focus:outline-none font-bold"
            />
            <button
              onClick={() => setRange({ from: "", to: "" })}
              className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition font-bold"
            >
              Clear
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition font-bold"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 transition font-bold"
            >
              Export JSON
            </button>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Spending by Category */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg font-bold">
          <h3 className="font-semibold mb-3 text-lg">Spending by Category</h3>
          {categoryData.labels.length ? (
            <Doughnut
              data={{
                labels: categoryData.labels,
                datasets: [{ data: categoryData.values, backgroundColor: COLORS }],
              }}
              options={{
                plugins: {
                  legend: { labels: { font: { weight: "bold" }, color: "#fff" } },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ₹${context.raw.toFixed(2)}`,
                    },
                  },
                },
              }}
            />
          ) : (
            <p className="text-sm text-white/70 font-bold">No category data available</p>
          )}
        </div>

        {/* Monthly Net Trend */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg font-bold">
          <h3 className="font-semibold mb-3 text-lg">Monthly Net Trend</h3>
          {monthlyTrend.labels.length ? (
    <div className="w-full h-72">
     <Line
  data={{
    labels: monthlyTrend.labels,
    datasets: [
      {
        label: "Net (Income - Expense)",
        data: monthlyTrend.values,
        borderColor: "#f1ecefff",
        backgroundColor: "rgba(234, 250, 5, 0.93)",
        tension: 0.3,
        fill: true,
        pointRadius: 6,         // bigger dots
        pointHoverRadius: 8,    // slightly bigger on hover
        pointBackgroundColor: "#edfd09ff", 
        pointBorderColor: "#fff", 
        pointBorderWidth: 2,
      },
    ],
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { font: { weight: "bold", size: 14 }, color: "#fff" },
      },
      
    },
    scales: {
      y: {
        ticks: { color: "#fff", font: { weight: "bold" } },
        grid: { color: "rgba(12, 1, 1, 0.92)" },
      },
      x: {
        ticks: { color: "#fff", font: { weight: "bold" } },
        grid: { color: "rgba(10, 0, 0, 0.93)" },
      },
    },
  }}
/>

    </div>
  ) : (
    <p className="text-sm text-white/70 font-bold">
      No trend data available
    </p>
  )}

        </div>
      </section>

      {/* Transactions List */}
      <section className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg mb-12 font-bold">
        <h3 className="font-semibold mb-3 text-lg">
          Transactions ({filtered.length})
        </h3>
        {filtered.length === 0 ? (
          <p className="text-sm text-white/70 font-bold">No transactions found.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filtered.map((t) => (
              <div
                key={t._id}
                className="p-3 bg-white/20 rounded-lg flex justify-between items-start font-bold"
              >
                <div>
                  <div className="font-bold">
                    {t.category} •{" "}
                    <span className="text-sm text-white/70 font-bold">
                      {new Date(t.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-white/80 font-bold">{t.description}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${
                      t.type === "income" ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {formatCurrency(t.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
