const { User } = require("../models");
const { Product } = require("../models");
const { Store } = require("../models");
const haversine = require("haversine-distance");
const fs = require("fs");
const { Op } = require("sequelize");

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

    let filePath;
    if (req.file) {
      filePath = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    } else {
      filePath = `${req.protocol}://${req.get(
        "host"
      )}/images/blank-profile-picture.png`;
    }

    const newStore = await Store.create({
      ...req.body,
      userId: availableUser.id,
      profilePicture: filePath,
    });
    res.status(200).json({ message: "Toko Berhasil Dibuat", data: newStore });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.getMyStore = async (req, res) => {
  try {
    const { id } = req.params;

    const availableStore = await Store.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          attributes: ["email", "name"],
        },
        {
          model: Product,
          attributes: ["id", "name", "picture", "description", "price"],
        },
      ],
    });
    if (!availableStore)
      return res.status(404).json({ message: "Tidak Ada Toko" });
    res.status(200).json(availableStore);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.getStoreNearly = async (req, res) => {
  try {
    const store = await Store.findAll({
      where: {
        id: {
          [Op.notLike]: req.query.myStoreId,
        },
      },
    });

    const nearlyStore = [];

    store.forEach((item) => {
      // ambil jarak
      const distance = haversine(
        { latitude: item.latitude * 1, longitude: item.longitude * 1 },
        { latitude: req.query.latitude * 1, longitude: req.query.longitude * 1 }
      );
      nearlyStore.push({ ...item.dataValues, distance: distance / 1000 });
    });

    res.status(200).json(nearlyStore.sort((a, b) => a.distance - b.distance));
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
    if (availableStore.profilePicture && req.file) {
      const splitFilename = availableStore.profilePicture.split("/");
      const fileNameOld = splitFilename[splitFilename.length - 1];
      const filepathOld = `./public/images/${fileNameOld}`;
      if (
        fileNameOld !== req.file.filename &&
        fileNameOld !== "blank-profile-picture.png"
      ) {
        fs.unlinkSync(filepathOld);
      }
    }
    let filePath;
    if (req.file) {
      filePath = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }
    await Store.update(
      {
        ...req.body,
        profilePicture: req.body.profilePicture || filePath,
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
