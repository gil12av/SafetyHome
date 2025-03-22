const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// נתיב הרשמה
router.post("/register", async (req, res) => {
  console.log("📥 Received Register Request:", req.body);
  const { firstName, lastName, email, password, phone, country } = req.body;

  if (!firstName || !lastName || !email || !password || !phone || !country) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      country,
    });

    await user.save();
    console.log("✅ New user registered:", user);

    // שמירת המשתמש בסשן
    req.session.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: req.session.user,
    });

  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});
module.exports = router;

// נתיב התחברות
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("firstName lastName email password");

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // שמירת המשתמש בסשן
    req.session.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    console.log("✅ Session Store Connected:", req.session);

    res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });

  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// נתיב לבדיקה האם המשתמש מחובר
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json(req.session.user);
});

// נתיב להתנקתות
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});
