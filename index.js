const express = require("express");
const dotenv = require("dotenv");
const { User } = require("./models");

dotenv.config();

const app = express();
app.use(express.json());
app.listen(process.env.APP_PORT, () => console.log("Server Running"));

app.get("/user", async (req, res) => {
  const resp = await User.findAll();
  res.json(resp);
});
