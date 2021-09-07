'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
    }
  };
  Like.init({
    UserId: DataTypes.INTEGER.UNSIGNED,
    RestaurantId: DataTypes.INTEGER.UNSIGNED
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};