const jwt = require("jsonwebtoken");

const JWT_PRIVATE_KEY = "secret_this_should_be_long_that_this";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token || !jwt.verify(token, JWT_PRIVATE_KEY)) {
      return res.status(401).json({ message: "Auth failed" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Auth failed" });
  }
};
