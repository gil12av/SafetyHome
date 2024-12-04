const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  userType: { type: String, default: "regular" }, // regular or admin
});

module.exports = mongoose.model("User", userSchema);
