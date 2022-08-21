const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://nicolebroadnax-capstone-front.herokuapp.com",
    ],
  })
);
const bcrypt = require("bcrypt");
const { User, db, Services } = require("./db/db.js");
const sessions = require("express-session");
const sequelizeStore = require("connect-session-sequelize")(sessions.Store);
const oneMonth = 1000 * 60 * 60 * 24 * 30;
app.use(
  sessions({
    secret: "mysecretkey",
    store: new sequelizeStore({ db }),
    cookie: { maxAge: oneMonth },
  })
);

app.get("/", (req, res) => {
  res.send({ hello: "world" });
});

let port = process.env.PORT;
if (!port) {
  port = 3001;
}

app.listen(port, () => {
  console.log("server online");
});

app.post("/login", async (req, res) => {
  const foundUser = await User.findOne(
    { where: { username: req.body.username } },
    { raw: true }
  );
  if (!foundUser) {
    res.send({ error: "User Not found !" });
  } else {
    const matchingPassword = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );
    if (matchingPassword) {
      req.session.user = foundUser;
      res.send({ success: true, message: "open sesame" });
    } else {
      res.send({ error: "Incorrect passwords Try aging." });
    }
  }
});

// app.get("/loginStatus", (req, res) => {
//   if (req.session.user) {
//     console.log("")
//     res.send({ isLoggedIn: true });
//   } else {
//     res.send({ isLoggedIn: false });
//   }
// });

app.get("/loggedIn", async (req, res) => {
  console.log("req.session: ", req.session);
  if (req.session) {
    if (req.session.user) {
      console.log("im logged in!!");
    } else {
      console.log("im not logged in~!");
    }
  } else {
    res.send({ success: false, message: "not logged in" });
  }
  //res.send({ success: true, message: "logged in" });
});

const createFirstUser = async () => {
  const users = await User.findAll();
  if (users.length === 0) {
    User.create({
      username: "Nicole",
      password: bcrypt.hashSync("hello1", 10),
    });
  }
};

app.get("/services/:category", async (req, res) => {
  res.send({
    services: await Services.findAll({
      where: { category: req.params.category },
    }),
  });
});

//createFirstUser();

//next Steps : 1 add user to database
// call the login endpoint from the fron end
//passing in the user names and  password in the request body  user.bodu
