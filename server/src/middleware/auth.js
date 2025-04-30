const authenticate = (req, res, next) => {
  if (!req.session || !req.session.user) {
    console.log("❌ No session found. Access denied.");
    return res.status(401).json({ error: "Access denied. Please log in." });
  }

  console.log("✅ Session verified:", req.session.user);
  req.user = req.session.user;
  next();
};

// for Admin only ;
const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    console.log("❌ No session found. Access denied.");
    return res.status(401).json({ error: "Access denied. Please log in." });
  }

  if (req.session.user.role !== "admin") {
    console.log(`🚫 User ${req.session.user.email} is not an admin.`);
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  console.log(`✅ Admin access granted to: ${req.session.user.email}`);
  req.user = req.session.user;
  next();
};


module.exports = { authenticate, requireAdmin };
