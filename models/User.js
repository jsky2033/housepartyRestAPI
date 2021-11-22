const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    authId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      max: 20,
    },
    membership: {
      type: String,
      enum: ["User", "Premium", "Admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
