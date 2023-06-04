const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { uuid } = require("uuidv4");
const { User } = require("../models");
const sendEmailVerification = require("../helper/sendEmailVerification");

exports.registerUser = async (req, res) => {
  try {
    // Ambil value dari body
    const { name, email, password, profilePicture } = req.body;

    // Cek apakah email sudah terdaftar atau belum
    const UserHasCreate = await User.findOne({
      where: {
        email,
      },
    });
    if (UserHasCreate)
      return res.status(404).json({ message: "Email sudah terdaftar" });

    const hashPassword = await argon2.hash(password);

    await User.create({
      name,
      email,
      uuid: uuid(),
      password: hashPassword,
      profilePicture,
      isEmailVerified: false,
    });
    res.status(201).json({ message: "Email Berhasil Didaftarkan" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    // Ambil value dari body
    const { email, password } = req.body;

    // Cek apakah email sudah terdaftar atau belum
    const userAvailable = await User.findOne({
      where: {
        email,
      },
    });
    if (!userAvailable)
      return res.status(404).json({ message: "Email belum terdaftar" });

    // Jika user ada maka cek password
    const match = await argon2.verify(userAvailable.password, password);
    if (!match) return res.status(400).json({ message: "Password Salah" });

    const accessToken = jwt.sign(
      {
        user: {
          id: userAvailable.id,
          uuid: userAvailable.uuid,
          name: userAvailable.name,
          email: userAvailable.email,
          profilePicture: userAvailable.profilePicture,
          emailVerified: userAvailable.emailVerified,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      id: userAvailable.id,
      uuid: userAvailable.uuid,
      name: userAvailable.name,
      email: userAvailable.email,
      profilePicture: userAvailable.profilePicture,
      emailVerified: userAvailable.emailVerified,
      token: { accessToken, expired: 60 },
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.changeProfilePicture = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });
    if (!currentUser)
      return res.status(404).json({ message: "User belum terdaftar" });
    // Hapus gambar lama
    if (currentUser.profilePicture) {
      const splitFilename = currentUser.profilePicture.split("/");
      const fileNameOld = splitFilename[splitFilename.length - 1];
      const filepathOld = `./public/images/${fileNameOld}`;
      if (fileNameOld !== req.file.filename) {
        fs.unlinkSync(filepathOld);
      }
    }

    const filePath = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    await User.update(
      { profilePicture: filePath },
      { where: { id: currentUser.id } }
    );

    res.status(200).json({ message: "Foto Profil Berhasil Diubah" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const currentUser = await User.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });
    if (!currentUser)
      return res.status(404).json({ message: "User belum terdaftar" });

    // cek old password
    const matchOldPassword = await argon2.verify(
      currentUser.password,
      oldPassword
    );
    if (!matchOldPassword)
      return res
        .status(400)
        .json({ message: "Password lama anda tidak cocok" });

    // proses update
    const hashNewPassword = await argon2.hash(newPassword);
    await User.update(
      { password: hashNewPassword },
      { where: { id: currentUser.id } }
    );
    res.status(200).json({ message: "Password Berhasil Diubah" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.sendVerification = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });
    if (!currentUser)
      return res.status(404).json({ message: "User belum terdaftar" });
    await sendEmailVerification(currentUser);
    res.status(200).json({ message: "Email Terkirim" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
