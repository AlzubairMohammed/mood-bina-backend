const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Products extends Model {}
Products.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    qty: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    sub_section_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "sub_sections",
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
    modelName: "Products",
    freezeTableName: true,
    tableName: "products",
    timestamps: false,
  }
);

Products.associate = ({ SubSections, Users, Images }) => {
  Products.belongsTo(SubSections, {
    foreignKey: "sub_section_id",
    as: "sub_sections",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Products.belongsTo(Users, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Products.hasOne(Images, {
    foreignKey: "product_id",
    as: "image",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
module.exports = () => Products;
