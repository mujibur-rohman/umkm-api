const { User } = require("../models");
const { Store } = require("../models");

exports.createStore = async (req, res) => {
  try {
    const { uuid } = req.params;
    // Cek apakah user ada
    const availableUser = await User.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (!availableUser)
      return res.status(404).json({ message: "User Tidak Ditemukan" });

    const availableStore = await Store.findOne({
      where: {
        userId: availableUser.id,
      },
    });
    if (availableStore)
      return res.status(404).json({ message: "Toko Sudah Terdaftar" });

    const filePath = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    await Store.create({
      ...req.body,
      userId: availableUser.id,
      profilePicture: filePath,
    });
    res.status(200).json({ message: "Toko Berhasil Dibuat" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.getMyStore = async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json(error.message);
  }
};
