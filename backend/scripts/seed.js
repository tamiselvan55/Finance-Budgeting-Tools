// Sample seed script to populate the database with demo transactions
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/finance';

const sample = [
  { type: 'income', amount: 50000, category: 'Salary', description: 'Monthly salary', date: new Date() },
  { type: 'expense', amount: 1500, category: 'Food', description: 'Groceries', date: new Date() },
  { type: 'expense', amount: 8000, category: 'Rent', description: 'October rent', date: new Date() },
  { type: 'expense', amount: 1200, category: 'Transport', description: 'Monthly metro pass', date: new Date() },
  { type: 'income', amount: 2000, category: 'Freelance', description: 'Project work', date: new Date() }
];

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to', mongoUri);
    await Transaction.deleteMany({});
    await Transaction.insertMany(sample);
    console.log('Seed data inserted');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
