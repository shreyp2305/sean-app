require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      +process.env.BCRYPT_SALT
    );
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
  const fetechedUser = await db.users.findOne({
    where: { email: req.body.email },
  });
  if (fetechedUser != null) {
    await bcrypt
      .compare(req.body.password, fetechedUser.password)
      .then((result) => {
        if (!result) {
          return res.status(401).json({ message: "Auth Failed" });
        }
        const token = jwt.sign(
          { email: fetechedUser.email, userId: fetechedUser.id },
          process.env.JWT_PRIVATE_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res
          .status(200)
          .json({ token: token, expiresIn: 3600, userId: fetechedUser.id });
      })
      .catch((err) => {
        return res.status(401).json({ message: "Auth failed" });
      });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
