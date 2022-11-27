const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Sections extends Model {}
Sections.init(
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
    image: {
      type: Sequelize.STRING(255),
      allowNull: false,
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
    modelName: "Sections",
    freezeTableName: true,
    tableName: "sections",
    timestamps: false,
  }
);

Sections.associate = ({ SubSections }) => {
  Sections.hasMany(SubSections, {
    foreignKey: "sections_id",
    as: "sub_sections",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
module.exports = () => Sections;
