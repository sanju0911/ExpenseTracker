const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      return new Promise((resolve, reject) => {
        const query = "SELECT * FROM expenselist;";

        connection.query(query, (err, results) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async insertNewName(username, expensename, amount) {
    try {
      const dateAdded = new Date();

      return new Promise((resolve, reject) => {
        const query =
          "INSERT INTO expenselist (username, expensename, amount, date_add) VALUES (?, ?, ?, ?);";

        connection.query(
          query,
          [username, expensename, amount, dateAdded],
          (err, result) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve({
                id: result.insertId,
                username: username,
                expensename: expensename,
                amount: amount,
                dateAdded: dateAdded,
              });
            }
          }
        );
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteRowById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM expenselist WHERE id = ?";

        connection.query(query, [id], (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(result.affectedRows);
          }
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateNameById(id, username, expensename, amount) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE expenselist SET username = ?, expensename = ?, amount = ? WHERE id = ?";

        connection.query(
          query,
          [username, expensename, amount, id],
          (err, result) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(result.affectedRows);
            }
          }
        );
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async searchByName(username) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM expenselist WHERE username = ?";

        connection.query(query, [username], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
