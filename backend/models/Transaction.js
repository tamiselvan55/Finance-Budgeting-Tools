const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
