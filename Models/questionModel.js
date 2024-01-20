const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // teamName: {
  //   type: String,
  //   required: true,
  // },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    // required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  difficultyLevel: {
    type: String,
    required: true,
  },
  answered: {
    type: String,
    // default: false,
  },
});

module.exports = mongoose.model("Question", questionSchema);
