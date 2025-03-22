const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const ScannedDevice = require("../models/ScannedDevices");
const { authenticate } = require('../middleware/auth');

router.post("/scan-network", async (req, res) => {
  const sessionUser = req.session?.user;

  if (!sessionUser || !mongoose.Types.ObjectId.isValid(sessionUser._id)) {
    return res.status(401).json({ error: "Unauthorized. Please login again." });
  }

  const userId = new mongoose.Types.ObjectId(sessionUser._id);
  console.log("📡 Scan request received for user:", userId);

  try {
    const pythonProcess = spawn("python3", ["./scripts/python_ScanDevice.py"]);
    let scanOutput = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      scanOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("🐍 Python Error:", data.toString());
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0 || errorOutput) {
        return res.status(500).json({ error: "Python script execution failed!", details: errorOutput });
      }

      try {
        const parsedOutput = JSON.parse(scanOutput);
        if (!parsedOutput.devices || parsedOutput.devices.length === 0) {
          return res.status(404).json({ message: "No devices found during the scan" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          const savedDevices = [];

          for (const device of parsedOutput.devices) {
            const existing = await ScannedDevice.findOne({
              userId,
              ipAddress: device.IP,
            });

            if (existing) {
              console.log(`🔁 Skipping existing device: ${device.IP}`);
              continue;
            }

            const newDevice = new ScannedDevice({
              userId,
              deviceName: device.Hostname || "Unknown Device",
              ipAddress: device.IP,
              macAddress: device.MAC || undefined,
              
            });

            const saved = await newDevice.save({ session });
            savedDevices.push(saved);
          }

          await session.commitTransaction();
          session.endSession();

          res.status(200).json({ message: "Scan completed successfully", devices: savedDevices });
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

    pythonProcess.on("error", (error) => {
      console.error("Failed to start Python process:", error);
      res.status(500).json({ error: "Failed to start scan process" });
    });

  } catch (error) {
    console.error("Unexpected server error:", error);
    res.status(500).json({ error: "An error occurred during the scan" });
  }
});

router.get('/scans', async (req, res) => {
  const sessionUser = req.session?.user;

  if (!sessionUser || !mongoose.Types.ObjectId.isValid(sessionUser._id)) {
    return res.status(401).json({ error: "Unauthorized. Please login again." });
  }

  const userId = new mongoose.Types.ObjectId(sessionUser._id);

  try {
    const scans = await ScannedDevice.find({ userId })
      .sort({ scanDate: -1 })
      .exec();

    res.json(scans);
  } catch (error) {
    console.error("Failed to retrieve scans:", error);
    res.status(500).json({ error: "Failed to retrieve scans." });
  }
});

module.exports = router;
