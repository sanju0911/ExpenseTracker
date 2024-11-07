const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const dbService = require("../db");

const User = require("../models/User");


router.post("/", userController.SignUp);

router.post("/insert", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
   
    const registeredEmails = await User.listAllEmails();

    if (registeredEmails.includes(email)) {
      res.status(400).json({ error: "Email already registered" });
    } else {
 
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
    const reviews = await User.listAllReviews(); 
    res.json({ data: reviews });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

 
  try {
    const result = await User.loginUser(username, password);
    res.json({ success: true, userId: result });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
