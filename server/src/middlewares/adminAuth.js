const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (decoded.role_id === 2) {
    return next();
  }

  return res.status(403).json({ message: "Access denied. Admins only." });
};
