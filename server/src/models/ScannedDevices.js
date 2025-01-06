const mongoose = require("mongoose");

const scannedDeviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deviceName: { type: String, required: true },
  ipAddress: { type: String, required: true },
  macAddress: { type: String },
  scanDate: { type: Date, default: Date.now },
});

// הוספת אינדקס לשליפות מהירות לפי userId ותאריך
scannedDeviceSchema.index({ userId: 1, scanDate: -1 });

module.exports = mongoose.model("ScannedDevice", scannedDeviceSchema);
