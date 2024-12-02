// סכמה של משתמשים במונגו.
const mongoose = require("mongoose");

// הגדרת הסכמה למשתמש
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // חובה למלא שם
    trim: true, // מסיר רווחים בתחילת ובסוף המחרוזת
  },
  email: {
    type: String,
    required: true,
    unique: true, // מבטיח שאין שני משתמשים עם אותו אימייל
    trim: true,
    lowercase: true, // הופך לאותיות קטנות
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // דרישה לאורך סיסמה מינימלי
  },
  createdAt: {
    type: Date,
    default: Date.now, // תאריך ברירת מחדל
  },
});

// יצירת מודל המשתמש
const User = mongoose.model("User", userSchema);

module.exports = User;
