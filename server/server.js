const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: "*",  // ניתן להחליף בכתובת הספציפית של הלקוח
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes:
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);

// ScanDevice:
const deviceRoutes = require("./src/routes/deviceRoute");
app.use("/api", deviceRoutes); // חיבור הנתיב לסריקה


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB!");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });