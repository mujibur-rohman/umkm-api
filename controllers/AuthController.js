const argon2d = require("argon2");
const { user } = require("../models");

exports.registerUser = async (req, res) => {
  try {
    // Ambil value dari body
    const { name, email, password, role, image } = req.body;

    // Cek apakah email sudah terdaftar atau belum
    const user = await user.findOne({
      where: {
        email,
      },
    });
    if (user) return res.status(404).json({ message: "User sudah terdaftar" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
