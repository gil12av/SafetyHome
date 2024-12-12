const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const ScannedDevice = require("../models/ScannedDevices");

// API לסריקת רשת ושמירת התוצאה
router.post("/scan-network", async (req, res) => {
  const { userId } = req.body;
  console.log("Request received for user ID:", userId); // דיבאג: בדיקת מזהה המשתמש

  if (!userId) {
    console.error("User ID is missing from the request."); // דיבאג: חסר מזהה משתמש
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    console.log("Starting Python script execution..."); // דיבאג: תחילת הרצת הסקריפט
    const pythonProcess = spawn("python3", ["server/scripts/python_ScanDevice.py"]);
    let scanOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      console.log("Python script output:", data.toString()); // דיבאג: פלט הסקריפט
      scanOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString()); // דיבאג: שגיאת הסקריפט
    });

    pythonProcess.on("close", async (code) => {
      console.log("Python script exited with code:", code); // דיבאג: קוד יציאה
      if (code !== 0) {
        return res.status(500).json({ error: "Python script failed to execute" });
      }

      try {
        const devices = JSON.parse(scanOutput); // פענוח JSON
        console.log("Devices scanned successfully:", devices); // דיבאג: רשימת מכשירים

        // שמירת תוצאות בבסיס הנתונים
        const savedDevices = await Promise.all(
          devices.map(async (device) => {
            return await ScannedDevice.create({
              userId,
              deviceName: device.deviceName || "Unknown Device",
              ipAddress: device.ipAddress,
              macAddress: device.macAddress,
            });
          })
        );

        console.log("Saved devices:", savedDevices); // דיבאג: רשימת מכשירים שנשמרו
        res.status(200).json({ message: "Scan completed successfully", devices: savedDevices });
      } catch (jsonError) {
        console.error("Error parsing or saving devices:", jsonError); // דיבאג: שגיאת עיבוד JSON
        res.status(500).json({ error: "Failed to process scanned devices" });
      }
    });
  } catch (error) {
    console.error("Unexpected server error:", error); // דיבאג: שגיאה כללית בשרת
    res.status(500).json({ error: "An error occurred during the scan" });
  }
});

module.exports = router;
