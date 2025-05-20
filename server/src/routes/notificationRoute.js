const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// שליפת כל ההתראות של המשתמש המחובר
router.get("/", async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  try {
    const notifications = await Notification.find({ user: user._id })
      .populate("sender", "firstName lastName")
      .populate("post", "content")
      .populate("message", "content")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// סימון התראה כנקראה
router.patch("/:id/read", async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ error: "Notification not found" });

    if (String(notif.user) !== user._id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    notif.isRead = true;
    await notif.save();

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

module.exports = router;
