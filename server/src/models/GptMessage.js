const mongoose = require("mongoose");

const gptMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: String, enum: ["user", "bot"], required: true },
  content: { type: String, required: true },
  source: { type: String, default: "general" }, // "cve_chat" | "bot_main" | future use
  cveCode: { type: String, default: null },     // לדוגמה: CVE-2023-XXXXX
  component: { type: String, default: null },   // לדוגמה: "AlertsScreen"
}, {
  timestamps: true,
});

module.exports = mongoose.model("GptMessage", gptMessageSchema);
