const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not logged in or unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = decoded;

  next();
};
