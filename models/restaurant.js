"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.belongsTo(models.Category, {
        foreignKey: { name: "CategoryId" },
      });
      Restaurant.hasMany(models.Comment);
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: "RestaurantId",
        as: "FavoritedUsers",
      });
      Restaurant.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: "RestaurantId",
        as: "LikedUsers",
      });
    }
  }
  Restaurant.init(
    {
      name: DataTypes.STRING(30),
      tel: DataTypes.STRING(40),
      address: DataTypes.STRING(127),
      opening_hours: DataTypes.STRING,
      description: DataTypes.TEXT(300),
      image: DataTypes.STRING(300),
      viewCounts: DataTypes.INTEGER.UNSIGNED,
    },
    {
      sequelize,
      modelName: "Restaurant",
    }
  );
  return Restaurant;
};
