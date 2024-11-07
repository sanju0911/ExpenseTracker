const express = require("express");
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.post("/add", authenticate, addExpense);
router.get("/", authenticate, getExpenses);
router.put("/update/:id", authenticate, updateExpense);
router.delete("/delete/:id", authenticate, deleteExpense);

module.exports = router;
