const express = require("express");
const mongoose = require("mongoose");
const register = require("./controllers/userController");
const app = express();

mongoose.connect(
  "mongodb+srv://ozkanrusan:31303130@cluster0.4pu8gzk.mongodb.net/okul"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "baglanmadi:"));
db.once("open", function () {
  console.log("baglandi");
});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(register);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
