const db = require("../db");

class User {
  static loginUser(name, password) {
    return new Promise((resolve, reject) => {
      const query = "SELECT name, password FROM customers WHERE name = ?";
      db.query(query, [name], (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          if (results.length === 0) {
            // Username not found
            reject("Username not found");
          } else {
            const storedPassword = results[0].password;
            if (storedPassword === password) {
              resolve({ message: "Login successful", username: name });
            } else {
              reject("Incorrect password");
            }
          }
        }
      });
    });
  }

  static getUserByEmail(email, callback) {
    const query = "SELECT * FROM customers WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length > 0) {
        return callback(null, results[0]);
      } else {
        return callback(null, null);
      }
    });
  }

  static listAllReviews() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM customers";
      db.query(query, (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  static listAllEmails() {
    return new Promise((resolve, reject) => {
      const query = "SELECT email FROM customers"; // Assuming the email column is named 'email'
      db.query(query, (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const emails = results.map((row) => row.email);
          resolve(emails);
        }
      });
    });
  }

  static createUser(name, email, phone, password) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO customers (name, email, phone, password) VALUES (?, ?, ?, ?)",
        [name, email, phone, password],
        (err, results) => {
          if (err) {
            reject(err); // Add error handling here
          } else {
            resolve(results.insertId);
          }
        }
      );
    });
  }
}

module.exports = User;
