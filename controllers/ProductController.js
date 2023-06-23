const { Store } = require("../models");
const { Product } = require("../models");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, picture, storeId } = req.body;
    console.log(req.file);
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
    const availableStore = await Store.findAll({
      where: {
        id: req.params.storeId,
      },
    });
    if (!availableStore)
      return res.status(404).json({ message: "Store Tidak Ditemukan" });

    res.status(200).json(availableStore);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
