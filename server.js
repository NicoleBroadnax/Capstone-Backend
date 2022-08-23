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

app.post("/register", async (req, res) => {
  const userWithThisUsername = await User.findOne({
    where: { username: req.body.username },
  });
  if (userWithThisUsername) {
    res.send({
      error: "Username is already taken. Go fish!",
    });
  } else {
    User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    res.send({ success: true });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send({ isLoggedIn: false });
});

const authRequired = (req, res, next) => {
  if (!req.session.user) {
    res.send({ error: "You're not signed in. No posting for you!" });
  } else {
    next();
  }
};

app.post("/", authRequired, async (req, res) => {
  await Post.create({
    title: req.body.title,
    content: req.body.content,
    authorID: req.session?.user?.id,
  });
  res.send({ post: "created" });
});
app.patch("/post/:id", authRequired, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  post.content = req.body.content;
  post.title = req.body.title;
  await post.save();
  res.send({ success: true, message: "It's been edited" });
});

app.delete("/post/:id", authRequired, async (req, res) => {
  await Post.destroy({ where: { id: req.params.id } });
  res.send({ success: true, message: "That post is outta here" });
});

app.get("/posts", async (req, res) => {
  res.send({
    posts: await Post.findAll({
      order: [["id", "DESC"]],
      include: [{ model: User, attributes: ["username"] }],
    }),
  });
});

app.get("/post/:id", async (req, res) => {
  res.send({ post: await Post.findByPk(req.params.id) });
});

//createFirstUser();

//next Steps : 1 add user to database
// call the login endpoint from the fron end
//passing in the user names and  password in the request body  user.bodu
