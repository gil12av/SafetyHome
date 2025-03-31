const express = require("express");
const router = express.Router();
const { fetchCVEsByKeyword } = require("../../services/cveServices");

router.get("/:keyword", async (req, res) => {
  const keyword = req.params.keyword;

  const results = await fetchCVEsByKeyword(keyword);
  res.json(results);
});

// חדש – שמירת התראות CVE
router.post("/save", async (req, res) => {
    try {
      const alerts = req.body.alerts;
  
      if (!alerts || !Array.isArray(alerts)) {
        return res.status(400).json({ error: "Missing alerts array" });
      }
  
      const savedAlerts = [];
  
      for (const alert of alerts) {
        const newAlert = new SecurityAlert(alert);
        await newAlert.save();
        savedAlerts.push(newAlert);
      }
  
      res.status(201).json(savedAlerts);
    } catch (error) {
      console.error("❌ Failed to save security alerts:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
module.exports = router;
