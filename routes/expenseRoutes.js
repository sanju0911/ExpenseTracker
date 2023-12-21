const express = require("express");
const router = express.Router();
const expense = require("../models/expenses");
const connection = require("../db"); // Import your database connection

router.get("/expenses", (req, res) => {
  res.sendFile(path.join(__dirname, "expenses.html"));
});

router.get("/getExpenses", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
  const offset = (page - 1) * itemsPerPage;

  const query = `SELECT * FROM expenselist LIMIT ? OFFSET ?`;
  connection.query(query, [itemsPerPage, offset], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    // Calculate the total number of expenses
    const totalQuery = "SELECT COUNT(*) as total FROM expenselist";
    connection.query(totalQuery, (err, countResult) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      const totalExpenses = countResult[0].total;

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalExpenses / itemsPerPage);

      return res.json({
        success: true,
        data: results,
        totalPages: totalPages,
      });
    });
  });
});

module.exports = router;
