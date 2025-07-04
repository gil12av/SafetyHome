// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  isSystem: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
