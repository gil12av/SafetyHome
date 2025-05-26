const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Notification = require("../models/Notification");

// שליפת כל הפוסטים
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "firstName lastName")
      .populate("comments.userId", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// יצירת פוסט חדש
router.post("/", async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  try {
    const newPost = new Post({
      userId: user._id,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      link: req.body.link,
    });

    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// הוספת תגובה לפוסט
router.post("/:id/comments", async (req, res) => {
    const user = req.session.user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
  
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });
  
      const newComment = {
        userId: user._id,
        text: req.body.text,
        createdAt: new Date(),
      };
  
      post.comments.push(newComment);
      await post.save();
  
      console.log("💬 New comment added by:", user.firstName, user.lastName);
      console.log("📌 On post ID:", post._id);
  
      // שליחת התראה אם המגיב לא הבעלים של הפוסט
      if (String(post.userId) !== String(user._id)) {
        console.log("🔔 creating notification for comment on post:", post._id);
  
        try {
          const createdNotif = await Notification.create({
            user: post.userId,           // מי יקבל את ההתראה
            sender: user._id,            // מי עשה את הפעולה
            type: "comment",
            post: post._id,
          });
  
          console.log("✅ Notification saved:", createdNotif);
        } catch (notifErr) {
          console.error("❌ Failed to save notification:", notifErr);
        }
      } else {
        console.log("⚠️ Not sending notification – user commented on their own post.");
      }
  
      const updatedPost = await Post.findById(req.params.id)
        .populate("userId", "firstName lastName")
        .populate("comments.userId", "firstName lastName");
  
      res.json(updatedPost);
    } catch (err) {
      console.error("❌ Failed to create comment:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  

// לייק או ביטול לייק
router.post("/:id/like", async (req, res) => {
    const user = req.session.user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
  
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });
  
      const alreadyLiked = post.likes.includes(user._id);
  
      if (alreadyLiked) {
        post.likes.pull(user._id);
        console.log("👎 User unliked post:", post._id);
      } else {
        post.likes.push(user._id);
        console.log("👍 User liked post:", post._id);
  
        // שליחת התראה רק אם המשתמש עושה לייק למישהו אחר
        if (String(post.userId) !== String(user._id)) {
          console.log("🔔 creating notification for like on post:", post._id);
  
          try {
            const createdNotif = await Notification.create({
              user: post.userId,
              sender: user._id,
              type: "like",
              post: post._id,
            });
  
            console.log("✅ Notification saved:", createdNotif);
          } catch (notifErr) {
            console.error("❌ Failed to save like notification:", notifErr);
          }
        } else {
          console.log("⚠️ Not sending like notification – user liked their own post.");
        }
      }
  
      await post.save();
  
      const updatedPost = await Post.findById(req.params.id)
        .populate("userId", "firstName lastName")
        .populate("comments.userId", "firstName lastName");
  
      res.json(updatedPost);
    } catch (err) {
      console.error("❌ Failed to like/unlike post:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  

  // ✅ שליפת פוסט לפי ID עבור הודעות לייק/תגובה
router.get("/:id", async (req, res) => {
    const user = req.session.user;
    const { id } = req.params;
  
    console.log("📥 GET /api/posts/:id =>", id); // בדיקה מה התקבל מהקליינט
  
    if (!user) return res.status(401).json({ error: "Not authenticated" });
  
    try {
      const post = await Post.findById(id);
      if (!post) {
        console.warn("⚠️ No post found with ID:", id);
        return res.status(404).json({ error: "Post not found" });
      }
  
      console.log("🟢 Found post:", post._id);
      res.json(post);
    } catch (err) {
      console.error("❌ Failed to fetch post:", err);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

 
 // ADDITIONAL TO EDIT AND DELETE POST :

// מחיקת פוסט
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// עדכון פוסט
router.put('/:id', async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Post not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


module.exports = router;
