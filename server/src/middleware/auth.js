const authenticate = (req, res, next) => {
  if (!req.session || !req.session.user) {
    console.log("❌ No session found. Access denied.");
    return res.status(401).json({ error: "Access denied. Please log in." });
  }

  console.log("✅ Session verified:", req.session.user);
  req.user = req.session.user;
  next();
};

module.exports = { authenticate };
