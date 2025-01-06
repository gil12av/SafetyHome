const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");  // נוספה ספריית jwt ליצירת טוקן
const User = require("../models/User");

const router = express.Router();

// מפתח סודי ליצירת טוקן (נשלף מקובץ .env)
const JWT_SECRET = process.env.JWT_SECRET || "defaultSecretKey";

// נתיב הרשמה
router.post("/register", async (req, res) => {
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

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// נתיב התחברות
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("firstName lastName email password");
    
    // הדפסת מידע משתמש מהמסד
    console.log("User found from DB:", user);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // יצירת טוקן לאחר אימות המשתמש
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("🔐 JWT Token generated:", token);

    // שליחת המשתמש והטוקן ללקוח (המיקום הזה נכון)
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName || "Guest",
        lastName: user.lastName,
        email: user.email,
      },
      token,  // הוספת הטוקן לתגובה
    });

    console.log("User sent to client:", {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

module.exports = router;
