const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Products = require("./Products.js");
const Model = Sequelize.Model;

class Images extends Model {}
Images.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    created: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "Images",
    freezeTableName: true,
    tableName: "images",
    timestamps: false,
  }
);

Images.associate = ({ Products }) => {
  Images.belongsTo(Products, {
    foreignKey: "product_id",
    as: "product",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
module.exports = () => Images;
