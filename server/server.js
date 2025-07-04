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
  origin: ["http://localhost:8081", "http://192.168.31.149:8081"], // הכתובת של Expo
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
    secure: false, 
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

// For saving Alert in dataBase
const alertRoutes = require("./src/routes/alertRoute");
app.use("/api/alerts", alertRoutes); 

// For schedule scan later: 
const scanScheduleRoute = require("./src/routes/scanScheduleRoute");
app.use("/api", scanScheduleRoute);

// For showing article in Dashboard:
const articleRoute = require("./src/routes/articleRoute");
app.use("/api/articles", articleRoute);

// For showing posts and comment and do like to different user:
const postRoutes = require("./src/routes/postRoute");
app.use("/api/posts", postRoutes);

// For send message between users, inbox with admin etc'.. :
const messageRoutes = require("./src/routes/messageRoute");
app.use("/api/messages", messageRoutes);

// For different type of notify to user.
const notificationRoute = require("./src/routes/notificationRoute");
app.use("/api/notifications", notificationRoute);

//For use Bot and chatgpt models.
const gptRoute = require("./src/routes/gptRoute");
app.use("/api/gpt", gptRoute);


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
