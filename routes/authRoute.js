const express = require("express");
const { registerUser } = require("../controllers/AuthController");

const authRoute = express.Router();

authRoute.post("/auth/register", registerUser);

module.exports = authRoute;
