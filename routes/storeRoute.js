const express = require("express");
const { createStore } = require("../controllers/StoreController");
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

const storeRoute = express.Router();

storeRoute.post("/store/:uuid", upload.single("profilePicture"), createStore);

module.exports = storeRoute;
