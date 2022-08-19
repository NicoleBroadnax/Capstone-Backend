const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

let options = {};
let databaseURL = process.env.DATABASE_URL;
if (!databaseURL) {
  // this means we're on localhost!
  databaseURL = "postgres://nicolebroadnax@localhost:5432/capstone";
  options = {
    logging: false,
  };
} else {
  // we're not on localhost !
  options = {
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
}

const db = new Sequelize(databaseURL, options);
const User = require("./User")(db);

//#5 connect and sync to DB
const connectToDB = async () => {
  try {
    await db.authenticate();
    console.log("Connected successfully");
    await db.sync(); //#6 sync by creating the tables based off our models if they don't exist already
    // await createFirstUser();
    // await createSecondUser();
  } catch (error) {
    console.error(error);
    console.error("PANIC! DB PROBLEMS!");
  }
};

connectToDB();

module.exports = { db, User }; //#7 export out the DB & Model so we can use it else where in our code
