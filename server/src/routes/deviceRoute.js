// this is route for device managment, such a scanning' update manually and delete devices after scan .
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const ScannedDevice = require("../models/ScannedDevices");
const { authenticate } = require('../middleware/auth');

async function runPythonScan(scriptPath, userId, res, deepScan = false) {
  try {
    const pythonProcess = spawn("python3", [scriptPath]);
    let scanOutput = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      scanOutput += data.toString();
      console.log("📦 Scan Output:", scanOutput);
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
              if (existing.scanType === "quick" && deepScan) {
                // we want to exchange the poor data from scan to the deep scan value.
                existing.deviceName = device.Hostname || existing.deviceName;
                existing.macAddress = device.MAC || existing.macAddress;
                existing.operatingSystem = device.OperatingSystem || existing.operatingSystem;
                existing.openPorts = device.OpenPorts?.length ? device.OpenPorts : existing.openPorts;
                existing.scanDate = new Date();
                existing.scanType = "deep"; // עדכון סוג סריקה
                await existing.save({ session });
                console.log(`✅ Updated device to deep scan: ${device.IP}`);
                savedDevices.push(existing);
              } else {
                console.log(`🔁 Skipping existing device: ${device.IP}`);
              }
              continue;
            }
          
            // ✨ אם אין בכלל - יוצרים חדש
            const newDevice = new ScannedDevice({
              userId,
              deviceName: device.Hostname || "Unknown Device",
              ipAddress: device.IP,
              macAddress: device.MAC || undefined,
              operatingSystem: deepScan ? device.OperatingSystem || null : null,
              openPorts: deepScan ? device.OpenPorts || [] : [],
              scanType: deepScan ? "deep" : "quick",  // distinguish between Deep and Quick Scan.
              scanDate: new Date(),
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
}

function validateSession(req) {
  const sessionUser = req.session?.user;
  if (!sessionUser || !mongoose.Types.ObjectId.isValid(sessionUser._id)) {
    return null;
  }
  return new mongoose.Types.ObjectId(sessionUser._id);
}

// סריקה רגילה (מהירה)
router.post("/scan-network", async (req, res) => {
  const userId = validateSession(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized. Please login again." });

  console.log("📡 Quick Scan request received for user:", userId);
  await runPythonScan("./scripts/python_ScanDevice.py", userId, res);
});

// סריקה עמוקה
router.post("/deep-scan", async (req, res) => {
  const userId = validateSession(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized. Please login again." });

  console.log("📡 Deep Scan request received for user:", userId);
  await runPythonScan("./scripts/advance_Scan.py", userId, res, true);
});

router.get('/scans', async (req, res) => {
  const userId = validateSession(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized. Please login again." });

  try {
    const scans = await ScannedDevice.find({ userId }).sort({ scanDate: -1 }).exec();
    res.json(scans);
  } catch (error) {
    console.error("Failed to retrieve scans:", error);
    res.status(500).json({ error: "Failed to retrieve scans." });
  }
});

//==================================================== //
// new routes for update and manage devices after scan:

// DELETE /api/devices/:id
router.delete("/devices/:id", async (req, res) => {
  try {
    await ScannedDevice.findByIdAndDelete(req.params.id);
    res.json({ deletedId: req.params.id });
  } catch (err) {
    console.error("DELETE DEVICE error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/devices/:id
router.put("/devices/:id", async (req, res) => {
  try {
    const { deviceName, ipAddress, macAddress, vendor, version } = req.body;

    const updated = await ScannedDevice.findByIdAndUpdate(
      req.params.id,
      {
        deviceName,
        ipAddress,
        macAddress,
        vendor,
        version,
        scanType: "manual",      
        source: "ManualScan"     
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("UPDATE DEVICE error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// POST /api/devices
router.post("/devices", async (req, res) => {
  try {
    const userId = req.session?.user?._id;
    if (!userId) 
      return res.status(401).json({ message: "Unauthorized" });

    const { deviceName, ipAddress, macAddress, vendor, version } = req.body;
    const newDevice = await ScannedDevice.create({
      deviceName,
      ipAddress,
      macAddress,
      vendor,
      version,
      userId,              // ← חובה
      scanType: "manual",  // ← חובה – דיפולט של רכיב ידני
      source: "ManualScan",
    });
    return res.json(newDevice);
  } catch (err) {
    console.error("CREATE DEVICE error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
