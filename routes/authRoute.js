const express = require("express");
const {
  registerUser,
  login,
  changeProfilePicture,
  updatePassword,
  sendVerification,
  activationEmail,
} = require("../controllers/AuthController");
const multer = require("multer");
const createEmailTransporter = require("../utils/createEmailTransporter");

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

const authRoute = express.Router();

authRoute.post("/auth/register", registerUser);
authRoute.post("/auth/login", login);
authRoute.put(
  "/auth/profile-picture/:uuid",
  upload.single("profilePicture"),
  changeProfilePicture
);
authRoute.put("/auth/change-password/:uuid", updatePassword);
authRoute.put("/auth/verify-email/:uuid", activationEmail);
authRoute.post("/auth/send-email-verification/:uuid", sendVerification);

module.exports = authRoute;
