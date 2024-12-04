const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { exec } = require("child_process");

require("dotenv").config();

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("../server/src/routes/userRoutes");
app.use("/api/users", userRoutes);

// Scan Network Route
app.get("/api/scan-network", (req, res) => {
  exec("nmap -sn 192.168.1.0/24", (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: "Network scan failed", details: stderr });
    } else {
      res.json({ result: stdout });
    }
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Successfully connected to MongoDB!");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });
