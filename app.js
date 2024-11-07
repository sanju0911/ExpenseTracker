const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const db = require("./config/db");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;
db.connect();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
