const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("🔑 Authorization Header at Server:", authHeader);

  const token = authHeader?.split(" ")[1];
  console.log("🛡️ Extracted Token at Server:", token);

  if (!token) {
    console.log("❌ No token provided.");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Invalid token:", error.message);
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = { authenticate };
