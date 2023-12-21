const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.SignUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User(name, email, phone, hashedPassword);

    // Save the user to the database
    User.createUser(user)
      .then((userId) => {
        res.status(201).json({ success: true, userId });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "An error occurred" });
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
