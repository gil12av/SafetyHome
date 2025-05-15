const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");

// שליחת הודעה
router.post("/", async (req, res) => {
  try {
    const sender = req.session.user._id;
    const { recipientId, content, isSystem = false } = req.body;

    const newMessage = new Message({
      sender,
      recipient: recipientId,
      content,
      isSystem,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error sending message:", error);
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

module.exports = router;
