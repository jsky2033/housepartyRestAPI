const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    authId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    pictureIndex: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
