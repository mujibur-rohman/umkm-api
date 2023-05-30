const express = require("express");
const dotenv = require("dotenv");
const { User } = require("./models");
const authRoute = require("./routes/authRoute");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.listen(process.env.APP_PORT, () => console.log("Server Running"));

app.get("/user", async (req, res) => {
  const resp = await User.findAll();
  res.json(resp);
});

app.use(authRoute);
