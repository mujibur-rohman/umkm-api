const express = require("express");
const {
  addTransaction,
  getTransactionByUser,
} = require("../controllers/TransactionController");

const transactionRoute = express.Router();

transactionRoute.post("/transaction", addTransaction);
transactionRoute.get("/transaction", getTransactionByUser);

module.exports = transactionRoute;
