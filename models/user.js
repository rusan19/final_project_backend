const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  number: {
    type: String,
  },
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
  },
});

module.exports = mongoose.model("users", UserSchema);
