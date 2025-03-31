const express = require("express");
const router = express.Router();
const SecurityAlert = require("../models/SecurityAlert");

// POST /api/alerts – שמירה של רשימת התראות חדשות
router.post("/", async (req, res) => {
  try {
    const alerts = req.body;

    // סינון כפילויות – לדוגמה לפי deviceId + cveId
    const newAlerts = [];
    for (const alert of alerts) {
      const exists = await SecurityAlert.findOne({
        deviceId: alert.deviceId,
        cveId: alert.cveId,
      });
      if (!exists) newAlerts.push(alert);
    }

    const saved = await SecurityAlert.insertMany(newAlerts);
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error saving alerts:", error.message);
    res.status(500).json({ message: "Failed to save alerts" });
  }
});

module.exports = router;
