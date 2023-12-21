const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); // Import the path module
const userRoutes = require("./routes/userRoutes");
const dotenv = require("dotenv");
const cors = require("cors");
const connection = require("./db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // Import your database connection
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const resetRoutes = require("./routes/resetRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 8007;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.set("view engine", "ejs");

// Serve static files (like HTML views)
app.use(express.static("views")); // Assuming your HTML files are in the "views" folder

// Define your routes
app.use("/users", userRoutes);
app.use("/", authRoutes);
app.use("/", expenseRoutes);
app.use("/", paymentRoutes);

// app.get("/", resetRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
