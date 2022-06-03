var mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  id: String,
  title: String,
  poster: String,
  genres: Array,
  year: Number,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "no username"],
    unique: true,
  },
  icon: {
    type: String,
    required: [true, "no icon"],
  },
  color: {
    type: String,
    required: [true, "no color"],
  },
  backgroundColor: {
    type: String,
    required: [true, "no background color"],
  },
  shows: [showSchema],
});

var userModel = mongoose.model("users", userSchema);

module.exports = userModel;
