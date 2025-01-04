const mongoose = require("mongoose");

const scannedDeviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deviceName: { type: String, required: true },
  ipAddress: { type: String, required: true },
  macAddress: { type: String },
  scanDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ScannedDevice", scannedDeviceSchema);
