const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const dbService = require("../db");

const User = require("../models/User");
// Import your User model with listAllEmails method

router.post("/", userController.SignUp);

router.post("/insert", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Use the listAllEmails method from your User model to fetch all registered emails
    const registeredEmails = await User.listAllEmails();

    if (registeredEmails.includes(email)) {
      res.status(400).json({ error: "Email already registered" });
    } else {
      // If the email is not registered, proceed with user creation
      await User.createUser(name, email, phone, password);
      res.json({ success: true });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/", async (req, res) => {
  try {
    const reviews = await User.listAllReviews(); // Implement this method in your Review model
    res.json({ data: reviews });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Replace this with your actual authentication logic
  try {
    const result = await User.loginUser(username, password);
    res.json({ success: true, userId: result });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
