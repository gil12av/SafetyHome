const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// נתיב הרשמה
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, phone, address } = req.body;

  if (!firstName || !lastName || !email || !password || !phone || !address) {
    console.log("❌ Missing fields during registration:", req.body);
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    console.log("🔍 Checking if user exists:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("🔐 Hashing password for:", email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    await user.save();
    console.log("✅ User registered successfully:", email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// נתיב התחברות
// נתיב התחברות
router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    console.log("❌ Missing email or password during login");
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    email = email.toLowerCase();  // התעלמות מאותיות גדולות/קטנות
    console.log("🔍 Searching for user:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("✅ Login successful for user:", email);
    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});


module.exports = router;
