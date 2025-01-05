const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const ScannedDevice = require("../models/ScannedDevices");

router.post("/scan-network", async (req, res) => {
  let { userId } = req.body;
  console.log("Request received for user ID:", userId);

  // בדיקת תקינות userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId format" });
  }
  userId = new mongoose.Types.ObjectId(userId);

  try {
    const pythonProcess = spawn("python3", ["./scripts/python_ScanDevice.py"]);
    let scanOutput = "";
    let errorOutput = "";

    // איסוף נתונים מ-scanOutput
    pythonProcess.stdout.on("data", (data) => {
      scanOutput += data.toString();
    });

    // איסוף שגיאות
    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("Python Error:", data.toString());
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0 || errorOutput) {
        return res.status(500).json({ error: "Python script execution failed!", details: errorOutput });
      }

      try {
        const parsedOutput = JSON.parse(scanOutput);

        // בדיקה אם התוצאה ריקה
        if (!parsedOutput.devices || parsedOutput.devices.length === 0) {
          return res.status(404).json({ message: "No devices found during the scan" });
        }

        // שמירת המכשירים במסד נתונים
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          const savedDevices = await Promise.all(
            parsedOutput.devices.map(async (device) => {
              return await ScannedDevice.create(
                [{
                  userId,
                  deviceName: device.Hostname || "Unknown Device",
                  ipAddress: device.IP,
                  macAddress: device.MAC,
                }],
                { session }
              );
            })
          );

          await session.commitTransaction();
          session.endSession();

          res.status(200).json({ message: "Scan completed successfully", devices: savedDevices.flat() });
        } catch (saveError) {
          console.error("❌ Error saving devices:", saveError);
          await session.abortTransaction();
          session.endSession();
          res.status(500).json({ error: "Failed to save scanned devices" });
        }
      } catch (jsonError) {
        console.error("❌ Error parsing scan results:", jsonError);
        res.status(500).json({ error: "Failed to process scan results" });
      }
    });

    // טיפול בשגיאה כללית
    pythonProcess.on("error", (error) => {
      console.error("Failed to start Python process:", error);
      res.status(500).json({ error: "Failed to start scan process" });
    });
  } catch (error) {
    console.error("Unexpected server error:", error);
    res.status(500).json({ error: "An error occurred during the scan" });
  }
});

module.exports = router;
