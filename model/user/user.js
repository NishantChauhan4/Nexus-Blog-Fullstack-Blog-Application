const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Posts" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
