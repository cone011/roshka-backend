const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    name: { type: String, require: true },
    phone: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
