const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("dotenv").config();

const app = express();
const PORT = 5001;

// try fix communicate between client and server .. //
app.use((req, res, next) => {
  console.log(`📥 Incoming Request: ${req.method} ${req.url}`);
  console.log(`🔍 Headers:`, req.headers);
  next();
});

// Middleware
app.use(cors({
  origin: ["http://localhost:8081", "http://192.168.31.68:8081"], // הכתובת של Expo
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

// הגדרת Session
app.use(session({
  secret: process.env.SESSION_SECRET || "defaultSecretKey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    secure: false, // אם אתה משתמש ב-HTTPS, שנה ל-true
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 24, // יום אחד
  },
}));

// Routes :
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);

// ScanDevice :
const deviceRoutes = require("./src/routes/deviceRoute");
app.use("/api", deviceRoutes);

// CVE :
const cveRoute = require("./src/routes/cveRoute");
app.use("/api/cve", cveRoute);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB!");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });
