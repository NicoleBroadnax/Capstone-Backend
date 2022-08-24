const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("comments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    serviceid: DataTypes.INTEGER,
  });
};
