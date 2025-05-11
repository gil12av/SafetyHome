// THIS IS ROUTE FOR SCHDULE FUTURE SCAN

const express = require("express");
const router = express.Router();
const ScanSchedule = require("../models/ScanSchedule");

// POST /api/scans/schedule
// יצירת או עדכון תזמון סריקה עתידית
router.post("/scans/schedule", async (req, res) => {
  try {
    const { scheduledDateTime } = req.body;
    const sessionUser = req.session.user;
    if (!sessionUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = sessionUser._id;

    let schedule = await ScanSchedule.findOne({ userId });
    if (schedule) {
      schedule.scheduledDateTime = new Date(scheduledDateTime);
    } else {
      schedule = new ScanSchedule({ userId, scheduledDateTime });
    }
    await schedule.save();
    res.json(schedule);
  } catch (err) {
    console.error("❌ Schedule POST error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/scans/schedule
// שליפת תזמון סריקה קיים (או null)
router.get("/scans/schedule", async (req, res) => {
  try {
    const sessionUser = req.session.user;
    if (!sessionUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = sessionUser._id;

    const schedule = await ScanSchedule.findOne({ userId });
    res.json(schedule || null);
  } catch (err) {
    console.error("❌ Schedule GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
