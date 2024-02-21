const mongoose = require("mongoose");

const TeamMemberSchema = mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  id: {
    type: Number,
    // required: true,
  },
});

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    teamName: {
      type: String,
      //   required: true,
    },
    teamMembers: [TeamMemberSchema],
    teamLeader: {
      type: String,
      // required: true,
    },
    teamLeaderRegNo: {
      type: String,
      // required: true,
    },
    teamLeaderMobile: {
      type: Number,
      // required: false
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      required: false,
      default: 0,
    },
    questionsSeeded: {
      type: Boolean,
      required: true,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
