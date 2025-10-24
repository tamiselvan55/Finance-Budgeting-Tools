require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const transactionsRoutes = require("./routes/transactions");
const authRoutes = require("./routes/auth");


const app = express();
app.use(cors());
app.use(express.json());

// connect DB
connectDB(process.env.MONGO_URI);

// health
app.get("/", (req, res) => res.json({ status: "ok", message: "Finance API running" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionsRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
