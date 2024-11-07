const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();
const connection = require("../db");
const jwt_secret = "secret";

let user = {
  id: "sghsthsr",
  email: "divyachinni986@gmail.com",
  password: "sfbrstghnrgbnrg",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "janardhansanjay143@gmail.com", // Enter your email address
    pass: "zicm tpqx ckgr ubjg",
  },
});
router.get("/", (req, res) => {
  res.send("Hello world!");
});

router.get("/forget-password", (req, res) => {
  res.render("forget-password");
});

router.post("/forget-password", (req, res) => {
  const { email } = req.body;
  if (email !== user.email) {
    res.send("user not found");
    return;
  }

  const secret = jwt_secret + user.password;
  const payload = {
    email: user.email,
    id: user.id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const link = `http://localhost:5050/reset-password/${user.id}/${token}`;

  const mailOptions = {
    from: "janardhansanjay143@gmail.com",
    to: user.email,
    subject: "Password Reset",
    html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("Error sending email.");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Password reset link has been sent to your email.");
    }
  });
});

router.get("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  if (id !== user.id) {
    res.send("invalid id ");
    return;
  }
  const secret = jwt_secret + user.password;
  try {
    const payload = jwt.verify(token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error.message);
    res.send("error.message");
  }
});

router.post("/reset-password/:id/:token", (req, res) => {
  // Add reset password logic here
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  if (id !== user.id) {
    res.send("invalid id ");
    return;
  }
  const secret = jwt_secret + user.password;
  try {
    const payload = jwt.verify(token, secret);
    user.password = password;
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.send("error.message");
  }
});

module.exports = router;
