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

  // בדיקה שכל השדות מלאים
  if (!firstName || !lastName || !email || !password || !phone || !country) {
    console.log("⚠️ Missing fields during registration");
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", existingUser.email);
      return res.status(400).json({ error: "User already exists" });
    }

    // הצפנת הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      country,
    });

    // שמירת המשתמש למסד הנתונים
    await user.save();
    console.log("✅ New user registered:", user);

    // יצירת טוקן עבור המשתמש
    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },  // תוקף של 30 יום
      (err, token) => {
        if (err) {
          console.error("❌ Error generating token:", err);
          return res.status(500).json({ error: "Failed to generate token" });
        }
        
        // החזרת תגובה עם המשתמש והטוקן
        console.log("📤 Response sent with token:", { user, token });
        res.status(201).json({
          message: "User registered successfully",
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          token,
        });
      }
    );
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
