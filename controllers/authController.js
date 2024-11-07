const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendMail");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();

    await sendMail({
      name: username,
      email: email,
      subject: "Welcome to Expense Tracker - Registration Successful",
      message: "Thank you for joining our expense tracker app!",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetCodes = new Map();

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "Email does not exist" });
  }

  const resetCode = generateResetCode();
  resetCodes.set(email, {
    code: resetCode,
    expires: Date.now() + 5 * 60 * 1000,
  });

  await sendMail({
    name: user.username,
    email: user.email,
    subject: "Password Reset Request",
    message: `Your password reset code is: ${resetCode}. This code will expire in 5 minutes.`,
  });

  res.status(200).json({ message: "Reset code sent to your email" });
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const storedCode = resetCodes.get(email);
  if (
    !storedCode ||
    storedCode.code !== code ||
    Date.now() > storedCode.expires
  ) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  user.password = newPassword;
  await user.save();

  resetCodes.delete(email);

  res.status(200).json({ message: "Password updated successfully" });
};

module.exports = { register, login, forgetPassword, resetPassword };
