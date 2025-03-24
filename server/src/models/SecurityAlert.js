// מודל זה שומר רכיב ואת הפגיעויות שהתגלו לאותו רכיב לפי כתובת mac או שם היצרן .
const mongoose = require("mongoose");

const securityAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScannedDevice",
    required: true,
  },
  deviceName: String,
  vendor: String,
  cveId: String,
  severity: String,
  description: String,
  suggestion: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SecurityAlert", securityAlertSchema);
