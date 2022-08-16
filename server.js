const express = require("express");
const app = express();
const bodyParser = require("body-parser");
server.use(express.json());
const cors = require("cors");
server.use(cors());

server.get("/", (req, res) => {
  res.send({ hello: "world" });
});
