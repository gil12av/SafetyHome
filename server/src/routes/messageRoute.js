const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const User = require("../models/User");

// שליחת הודעה
router.post("/", async (req, res) => {
    const user = req.session.user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
  
    const { recipientId, content, isSystem } = req.body;
  
    try {
      const message = new Message({
        sender: user._id,
        recipient: recipientId,
        content,
        isSystem,
      });
  
      await message.save();
  
      // ✅ תוספת: יצירת Notification רק אם השולח ≠ מקבל
      if (String(recipientId) !== String(user._id)) {
        try {
          await Notification.create({
            user: recipientId,       // המשתמש שיקבל את ההתראה
            sender: user._id,        // השולח
            type: "message",         // סוג ההתראה
            message: Message._id ,        // אפשר להשתמש בו לצורך תצוגה אם רוצים
          });
          console.log("✅ Notification for message created");
        } catch (notifErr) {
          console.error("❌ Failed to create message notification:", notifErr);
        }
      } else {
        console.log("⚠️ Skipped notification – sender and recipient are the same user.");
      }
  
      res.status(201).json(message);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      res.status(500).json({ error: "Failed to send message" });
    }
  });
  
// שליפת כל ההודעות שהמשתמש קיבל
router.get("/", async (req, res) => {
  try {
    const userId = req.session.user._id;
    const messages = await Message.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "firstName lastName role");
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// סימון הודעה כנקראה
router.patch("/:messageId/read", async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    message.isRead = true;
    await message.save();
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Failed to update read state:", error);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

// קבלת שיחה בין שני משתמשים
router.get("/conversation/:userId", async (req, res) => {
    const currentUser = req.session.user;
    const otherUserId = req.params.userId;
  
    if (!currentUser) return res.status(401).json({ error: "Not authenticated" });
  
    try {
      const conversation = await Message.find({
        $or: [
          { sender: currentUser._id, recipient: otherUserId },
          { sender: otherUserId, recipient: currentUser._id }
        ]
      })
        .sort({ createdAt: 1 }) // לפי סדר כרונולוגי
        .populate("sender", "firstName lastName")
        .populate("recipient", "firstName lastName");
  
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });
  
module.exports = router;
