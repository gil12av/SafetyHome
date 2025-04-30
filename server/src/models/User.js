const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  role: { type: String, enum: [ "user", "admin" ], default: "user" },  // Add to Admin User
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);