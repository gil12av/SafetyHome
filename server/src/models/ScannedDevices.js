// מודל זה שומר את הרכיבים שנסרקו לאחר הפעלת פונקציית הסריקה
const mongoose = require("mongoose");

const scannedDeviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deviceName: { type: String, required: true },
  ipAddress: { type: String, required: true },
  macAddress: { type: String },
  operatingSystem: { type: String },
  openPorts: [
    {
      port: Number,
      service: String,
      product: String,
      version: String,
    },
  ],
  scanDate: { type: Date, default: Date.now },
  // 🆕 הוספה:
  scanType: { type: String, enum: ["quick", "deep"], required: true },
});


// אינדקס לשליפה מהירה לפי משתמש ותאריך
scannedDeviceSchema.index({ userId: 1, scanDate: -1 });

module.exports = mongoose.model("ScannedDevice", scannedDeviceSchema);
