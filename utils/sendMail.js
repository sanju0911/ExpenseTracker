const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendMail = async (user) => {
  try {
    const info = await transporter.sendMail({
      from: `"Sanju 👻" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: user.subject,
      text: user.message,
      html: `<p>${user.message}</p>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
