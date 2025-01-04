const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const ScannedDevice = require("../models/ScannedDevices");

router.post("/scan-network", async (req, res) => {
  let { userId } = req.body;
  console.log("Request received for user ID:", userId);

  try {
    // בדיקת תקינות userId והמרתו ל-ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }
    userId = new mongoose.Types.ObjectId(userId);

    const pythonProcess = spawn("python3", ["./server/scripts/python_ScanDevice.py"]);
    let scanOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      scanOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python Error:", data.toString());
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "Python script failed to execute!" });
      }

      try {
        const parsedOutput = JSON.parse(scanOutput);
        if (parsedOutput.devices && parsedOutput.devices.length > 0) {
          const savedDevices = await Promise.all(
            parsedOutput.devices.map(async (device) => {
              return await ScannedDevice.create({
                userId,
                deviceName: device.Hostname || "Unknown Device",
                ipAddress: device.IP,
                macAddress: device.MAC,
              });
            })
          );
          res.status(200).json({ message: "Scan completed successfully", devices: savedDevices });
        } else {
          res.status(404).json({ message: "No devices found" });
        }
      } catch (jsonError) {
        console.error("Error parsing or saving devices:", jsonError);
        res.status(500).json({ error: "Failed to process scanned devices" });
      }
    });
  } catch (error) {
    console.error("Unexpected server error:", error);
    res.status(500).json({ error: "An error occurred during the scan" });
  }
});

module.exports = router;
