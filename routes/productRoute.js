const express = require("express");
const {
  createProduct,
  getProduct,
} = require("../controllers/ProductController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExt = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedExt.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Gambar tidak valid"));
    }
  },
  limits: { fileSize: 2097152 },
});

const productRoute = express.Router();

productRoute.post("/product", upload.single("picture"), createProduct);
productRoute.get("/product/:storeId", getProduct);

module.exports = productRoute;