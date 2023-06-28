"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Store.belongsTo(models.User, {
        as: "",
        foreignKey: "userId",
      });
      Store.hasMany(models.Product, {
        as: "",
        foreignKey: "storeId",
      });
    }
  }
  Store.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      profilePicture: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      noTlp: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
