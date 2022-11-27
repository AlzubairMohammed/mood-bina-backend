const Sequelize = require("sequelize");

const sequelize = new Sequelize("e_commerce", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
