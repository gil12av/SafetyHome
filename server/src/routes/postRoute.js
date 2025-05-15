const express = require("express");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const router = express.Router();

// יצירת פוסט חדש
router.post("/", async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { content, imageUrl, link } = req.body;

    const newPost = new Post({ userId, content, imageUrl, link });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("❌ Failed to create post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// שליפת כל הפוסטים (מהחדש לישן)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName role"); // מציג שם משתמש
    res.json(posts);
  } catch (error) {
    console.error("❌ Failed to fetch posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// לייק/ביטול לייק
router.post("/:postId/like", async (req, res) => {
  try {
    const userId = req.session.user._id;
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (error) {
    console.error("❌ Failed to toggle like:", error);
    res.status(500).json({ error: "Like failed" });
  }
});

// For Comment  //

// הגשת תגובה
router.post("/:postId/comments", async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { text } = req.body;
    const postId = req.params.postId;

    const comment = new Comment({ postId, userId, text });
    await comment.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error("❌ Failed to add comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// שליפת תגובות לפוסט
router.get("/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: 1 })
      .populate("userId", "firstName lastName");
    res.json(comments);
  } catch (error) {
    console.error("❌ Failed to fetch comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});


module.exports = router;
