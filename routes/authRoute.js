const express = require("express");
const { registerUser, login } = require("../controllers/AuthController");

const authRoute = express.Router();

authRoute.post("/auth/register", registerUser);
authRoute.post("/auth/login", login);

module.exports = authRoute;
