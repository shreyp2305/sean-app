const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if (!token || !decodedToken) {
      return res.status(401).json({ message: "Auth failed" });
    }
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: "Auth failed" });
  }
};
