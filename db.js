const dotenv = require("dotenv");
dotenv.config();

const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
