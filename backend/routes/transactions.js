const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

// Get all transactions (sorted by date desc)
router.get("/", async (req, res) => {
  try {
    const tx = await Transaction.find().sort({ date: -1 });
    res.json({ transactions: tx });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create transaction
router.post("/", async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const t = new Transaction({ type, amount, category, description, date });
    await t.save();
    res.status(201).json({ message: "Transaction created", transaction: t });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const updated = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated", transaction: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const removed = await Transaction.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Summary: totals and per-category totals
router.get("/summary/all", async (req, res) => {
  try {
    const agg = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);
    const breakdown = await Transaction.aggregate([
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" }
        }
      }
    ]);
    const income = agg.find(a => a._id === "income")?.total || 0;
    const expense = agg.find(a => a._id === "expense")?.total || 0;
    res.json({ income, expense, balance: income - expense, breakdown });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
