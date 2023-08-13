const express = require("express");
const router = express.Router();
const db = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const BCRYPT_SALT = 10;
const JWT_PRIVATE_KEY = "secret_this_should_be_long_that_this";

router.post("/signup", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALT);
    const User = await db.users.create({
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(200).json({
      message: "User Created",
      result: User,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      err: "Error creating user",
    });
  }
});

router.post("/login", async (req, res, next) => {
  let fetechedUser;
  await db.users
    .findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      fetechedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({ message: "Auth Failed" });
      }
      const token = jwt.sign(
        { email: fetechedUser.email, userId: fetechedUser.id },
        JWT_PRIVATE_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({ token: token });
    })
    .catch((err) => {
      return res.status(401).json({ message: "Auth failed" });
    });
});

module.exports = router;
