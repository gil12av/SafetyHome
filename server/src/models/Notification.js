// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // למי ההתראה מופנית
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // מי יצר את ההתראה
  type: {
    type: String,
    enum: ["like", "comment", "message"],
    required: true
  },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // רלוונטי ללייק/תגובה
  message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // רלוונטי להודעה
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
