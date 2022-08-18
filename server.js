const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const { User, db } = require("./db/db.js");

app.get("/", (req, res) => {
  res.send({ hello: "world" });
});

app.listen(3001, () => {
  console.log("server online");
});
