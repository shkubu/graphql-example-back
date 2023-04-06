const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.User = mongoose.model(
  "User",
  new Schema(
    {
      userName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      loginCount: {
        type: Number,
        required: true,
      },
    },
    { timestamps: false }
  )
);
