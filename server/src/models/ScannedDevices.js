// מודל זה שומר את הרכיבים שנסרקו לאחר הפעלת פונקציית הסריקה
const mongoose = require("mongoose");

const scannedDeviceSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deviceName:      { type: String, required: true },
  ipAddress:       { type: String, required: true },
  macAddress:      { type: String },
  operatingSystem: { type: String },
  openPorts: [
    {
      port: Number,
      service: String,
      product: String,
      version: String,
    },
  ],
  version:  { type: String, default: "unknown"},
  vendor:   { type: String, default: "unknown"},
  scanDate: { type: Date, default: Date.now },
  // 🆕 הוספה:
  scanType: { type: String, enum: ["quick", "deep", "manual"], required: true },
  source:   { type: String, enum:["AutoScan", "ManualScan"], default: "AutoScan" },
});


// אינדקס לשליפה מהירה לפי משתמש ותאריך
scannedDeviceSchema.index({ userId: 1, scanDate: -1 });

// אינדקס ייחודי למניעת כפילויות של אותו רכיב לאותו משתמש
scannedDeviceSchema.index({ userId: 1, ipAddress: 1 }, { unique: true });

module.exports = mongoose.model("ScannedDevice", scannedDeviceSchema);
