const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("services", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    website: DataTypes.STRING,
    Image: DataTypes.STRING,
  });
};
/// query the user for database.
