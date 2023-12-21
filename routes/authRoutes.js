const express = require("express");
const router = express.Router();
const dbService = require("../models/expenses");

router.post("/insert", async (request, response) => {
  try {
    const username = request.body.username;
    const expensename = request.body.expensename;
    const amount = request.body.amount;

    const db = dbService.getDbServiceInstance();
    const result = await db.insertNewName(username, expensename, amount);

    response.json({ success: true });
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "An error occurred." });
  }
});

router.get("/getAll", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

router.patch("/update", (request, response) => {
  const { id, username, expensename, amount } = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.updateNameById(id, username, expensename, amount);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

router.delete("/delete/:id", (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowById(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

router.get("/search/:username", (request, response) => {
  const { username } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.searchByName(username);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

module.exports = router;
