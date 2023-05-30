const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
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
          role: userAvailable.role,
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
      role: userAvailable.role,
      emailVerified: userAvailable.emailVerified,
      token: { accessToken, expired: 60 },
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
