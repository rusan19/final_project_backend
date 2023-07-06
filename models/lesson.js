const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  code: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("lesson", LessonSchema);
