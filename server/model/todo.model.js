const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    taskContent: {
      type: String,
      max: 255,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    completed: {
      type: Boolean,
      index: true,
    },
  },
  { timestamps: true } // createdAt, updatedAt timestamps will be taken care of by this automatically
);

module.exports = mongoose.model("Todo", todoSchema, "todo");
