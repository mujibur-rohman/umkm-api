const { Store } = require("../models");
const { Product } = require("../models");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, storeId } = req.body;
    const availableStore = await Store.findOne({
      where: {
        id: storeId,
      },
    });
    if (!availableStore)
      return res.status(404).json({ message: "Store Tidak Ditemukan" });

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
    const newProduct = await Product.create({
      name,
      description,
      price,
      picture: filePath,
      storeId,
    });
    res.status(200).json({ message: "Ada", data: newProduct });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const availableStore = await Store.findOne({
      where: {
        id: req.params.storeId,
      },
    });
    if (!availableStore)
      return res.status(404).json({ message: "Store Tidak Ditemukan" });

    const response = await Product.findAll({
      where: {
        storeId: availableStore.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const availableProduct = await Product.findOne({
      where: {
        id: req.params.productId,
      },
    });
    if (!availableProduct)
      return res.status(404).json({ message: "Tidak Ada Produk" });
    // Hapus gambar lama
    if (availableProduct.picture && req.file) {
      const splitFilename = availableProduct.picture.split("/");
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
    await Product.update(
      {
        ...req.body,
        picture: req.body.picture || filePath,
      },
      { where: { id: availableProduct.id } }
    );
    res.status(200).json({
      message: "Produk Berhasil Diubah",
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const availableProduct = await Product.findOne({
      where: {
        id: req.params.productId,
      },
    });
    if (!availableProduct)
      return res.status(404).json({ message: "Tidak Ada Produk" });
    await Product.destroy({
      where: {
        id: availableProduct.id,
      },
    });
    // Hapus gambar lama
    if (availableProduct.picture) {
      const splitFilename = availableProduct.picture.split("/");
      const fileNameOld = splitFilename[splitFilename.length - 1];
      const filepathOld = `./public/images/${fileNameOld}`;
      if (fileNameOld !== "blank-profile-picture.png") {
        fs.unlinkSync(filepathOld);
      }
    }
    res.status(200).json({
      message: "Produk Berhasil Dihapus",
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
