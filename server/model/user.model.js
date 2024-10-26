const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      max: 255,
      required: true,
    },
    email: {
      type: String,
      index: true,
      required: true,
    },
    lastName: {
      type: String,
      index: true,
    },
    imgURL: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true } // createdAt, updatedAt timestamps will be taken care of by this automatically
);

module.exports = mongoose.model("User", userSchema, "users");
