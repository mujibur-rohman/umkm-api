const { Transaction } = require("../models");
const { Store } = require("../models");
const { Product } = require("../models");
const { User } = require("../models");

exports.addTransaction = async (req, res) => {
  try {
    const availableStore = await Store.findOne({
      where: {
        id: req.body.storeId,
      },
    });
    if (!availableStore)
      return res.status(404).json({ message: "Store Tidak Ditemukan" });

    const availableProduct = await Product.findOne({
      where: {
        id: req.body.productId,
      },
    });
    if (!availableProduct)
      return res.status(404).json({ message: "Produk Tidak Ditemukan" });

    const availableUser = await User.findOne({
      where: {
        id: req.body.userId,
      },
    });
    if (!availableUser)
      return res.status(404).json({ message: "User Tidak Ditemukan" });

    const newTransaction = await Transaction.create({
      ...req.body,
      statusPayment: 0,
      statusDelivery: 0,
    });
    res.status(200).json({
      message: "Transaksi berhasil ditambahkan",
      data: newTransaction,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.getTransactionByUser = async (req, res) => {
  try {
    const availableUser = await User.findOne({
      where: {
        id: req.query.userId,
      },
    });
    if (!availableUser)
      return res.status(404).json({ message: "User Tidak Ditemukan" });
    const trx = await Transaction.findAll({
      where: {
        userId: availableUser.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "email", "name"],
        },
        {
          model: Store,
          attributes: ["id", "name"],
        },
      ],
    });
    res.status(200).json(trx);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
