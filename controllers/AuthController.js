const argon2 = require("argon2");
const { User } = require("../models");

exports.registerUser = async (req, res) => {
  try {
    // Ambil value dari body
    const { name, email, password, role, profilePicture } = req.body;

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
      password: hashPassword,
      role,
      profilePicture,
      isEmailVerified: false,
    });
    res.status(201).json({ message: "Email Berhasil Didaftarkan" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
