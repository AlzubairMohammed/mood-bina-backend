const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class SubSections extends Model {}
SubSections.init(
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
    sections_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "SubSections",
    freezeTableName: true,
    tableName: "sub_sections",
    timestamps: false,
  }
);

SubSections.associate = ({ Sections }) => {
  SubSections.belongsTo(Sections, {
    foreignKey: "sections_id",
    as: "sections",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
module.exports = () => SubSections;
