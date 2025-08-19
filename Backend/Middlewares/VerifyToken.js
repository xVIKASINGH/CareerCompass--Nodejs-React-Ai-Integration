const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
  const token = req.cookies.token; // 👈 comes from res.cookie
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👈 attach user info to req
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = verifytoken;
