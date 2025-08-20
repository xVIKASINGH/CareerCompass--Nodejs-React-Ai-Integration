const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
 

  const token = req.cookies.token;


  if (!token) return res.status(401).json({ error: "Not authenticated" });
   
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log("Decoded token:", decoded);
    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = verifytoken;
