const express = require("express");
const dotenv = require("dotenv");
const authRoute = require("./routes/authRoute");
const cors = require("cors");
const storeRoute = require("./routes/storeRoute");
const productRoute = require("./routes/productRoute");

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(express.static("public"));
app.listen(process.env.APP_PORT, () => console.log("Server Running"));

app.use(authRoute);
app.use(storeRoute);
app.use(productRoute);
