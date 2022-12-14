const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  });
};
/// query the user for database.  