// מודל זה שומר את הרכיבים שנסרקו לאחר הפעלת פונקציית הסריקה
const mongoose = require("mongoose");

const scannedDeviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deviceName: { type: String, required: true },
  ipAddress: { type: String, required: true },
  macAddress: { type: String }, // לא חובה ולא ייחודי
  scanDate: {
    type: String,
    default: () =>
      new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
  },
});

// אינדקס לשליפה מהירה לפי משתמש ותאריך
scannedDeviceSchema.index({ userId: 1, scanDate: -1 });

module.exports = mongoose.model("ScannedDevice", scannedDeviceSchema);
