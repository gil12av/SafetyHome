const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const ScannedDevices = require("../models/ScannedDevices");

const router = express.Router();

router.post("/scan", async (req, res) => {
  try {
    const userId = req.body.userId;

    // בדוק האם userId נשלח בבקשה
    if (!userId) {
      console.log("User ID missing from request body.");
      return res.status(400).json({ error: "User ID is required." });
    }

    const scriptPath = path.join(__dirname, "../scripts/python_ScanDevice.py");
    console.log("Script path:", scriptPath);

    // ביצוע הסקריפט של Python
    console.log("Executing Python script...");
    exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing Python script:", error.message);
        return res.status(500).json({ error: "Scan failed due to script error." });
      }

      if (stderr) {
        console.error("Python script stderr:", stderr);
        return res.status(500).json({ error: "Scan failed due to script stderr." });
      }

      console.log("Python script executed successfully.");
      console.log("Python script output (stdout):", stdout);

      try {
        // נסה לפרש את הפלט ל-JSON
        const parsedOutput = JSON.parse(stdout);

        // בדוק אם יש מפתח 'devices'
        if (!parsedOutput.devices || !Array.isArray(parsedOutput.devices)) {
          throw new Error("Invalid script output: Missing 'devices' array.");
        }

        const scannedDevices = parsedOutput.devices.map((device) => ({
          ...device,
          userId,
        }));

        console.log("Parsed devices ready for database:", scannedDevices);

        // שמירת המכשירים בבסיס הנתונים
        ScannedDevices.insertMany(scannedDevices)
          .then(() => {
            console.log("Devices saved to database successfully.");
            res.status(200).json({ message: "Scan completed successfully!", devices: scannedDevices });
          })
          .catch((dbError) => {
            console.error("Database error while saving devices:", dbError.message);
            res.status(500).json({ error: "Failed to save scanned devices." });
          });
      } catch (parseError) {
        console.error("Error parsing JSON from Python script:", parseError.message);
        res.status(500).json({ error: "Invalid script output." });
      }
    });
  } catch (error) {
    console.error("Error handling scan request:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
