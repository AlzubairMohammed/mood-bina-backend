const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Users extends Model {
  toJSON() {
    return { ...this.get(), password: undefined };
  }
}
Users.init(
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
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    tel: {
      type: Sequelize.STRING(13),
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    c: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
    },
    u: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
    },
    d: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
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
    modelName: "Users",
    freezeTableName: true,
    tableName: "users",
    timestamps: false,
  }
);

Users.associate = ({ Products }) => {
  Users.hasMany(Products, {
    foreignKey: "user_id",
    as: "products",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
module.exports = () => Users;
