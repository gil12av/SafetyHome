const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    console.log("MongoDB: URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000, // זמן מקסימלי לנסיונות התחברות
    });
    console.log("✅ Successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

module.exports = connectToMongoDB