const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ScanDevices = require("../models/ScannedDevices");
const { requireAdmin } = require("../middleware/auth");

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
      role: 'user', // To add defualt to user -- admin setup new user
    });

    await user.save();
    console.log("✅ New user registered:", user);

    // שמירת המשתמש בסשן
    req.session.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role, // -- admin setup new user
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
    const user = await User.findOne({ email });

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
      role: user.role,
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


// -------------------- For Admin only ----------------- //
// מחזיר את כל המשתמשים – מיועד לאדמין בלבד
router.get("/", requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("❌ Failed to fetch users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// שינוי תפקיד של משתמש (רק אדמין)
router.put("/:id/role", requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(user);
  } catch (error) {
    console.error("❌ Failed to update role:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
});

// מחיקת משתמש לפי ID (רק אדמין)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Failed to delete user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// collect stats to show it on AdminScreen
router.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });
    const scanCount = await ScannedDevice.countDocuments();

    res.json({
      totalUsers,
      adminCount,
      userCount: totalUsers - adminCount,
      scanCount,
    });
  } catch (error) {
    console.error("❌ Failed to fetch admin stats:", error);
    res.status(500).json({ error: "Failed to get admin stats" });
  }
});

