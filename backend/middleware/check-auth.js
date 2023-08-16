const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token || !jwt.verify(token, process.env.JWT_PRIVATE_KEY)) {
      return res.status(401).json({ message: "Auth failed" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Auth failed" });
  }
};
