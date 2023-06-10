const { User } = require("../models");
const { Store } = require("../models");
const fs = require("fs");

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
      include: {
        model: User,
        attributes: ["email", "name"],
      },
    });
    if (!availableStore)
      return res.status(404).json({ message: "Tidak Ada Toko" });
    res.status(200).json(availableStore);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.updateStore = async (req, res) => {
  try {
    const availableStore = await Store.findOne({
      where: {
        id: req.params.storeId,
      },
    });
    if (!availableStore)
      return res.status(404).json({ message: "Tidak Ada Toko" });

    // Hapus gambar lama
    if (availableStore.profilePicture) {
      const splitFilename = availableStore.profilePicture.split("/");
      const fileNameOld = splitFilename[splitFilename.length - 1];
      const filepathOld = `./public/images/${fileNameOld}`;
      if (fileNameOld !== req.file.filename) {
        fs.unlinkSync(filepathOld);
      }
    }

    const filePath = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    await Store.update(
      {
        ...req.body,
        profilePicture: filePath,
      },
      { where: { id: availableStore.id } }
    );
    res.status(200).json({
      message: "Toko Berhasil Diubah",
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const availableStore = await Store.findOne({
      where: {
        id: req.params.storeId,
      },
    });
    if (!availableStore)
      return res.status(404).json({ message: "Tidak Ada Toko" });
    await Store.destroy({
      where: {
        id: availableStore.id,
      },
    });
    res.status(200).json({
      message: "Toko Berhasil Dihapus",
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
