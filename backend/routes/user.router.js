const express = require("express");
const router = express.Router();
const db = require("../models/index");
const bcrypt = require("bcrypt");

const BCRYPT_COST = 10;

router.post("/signup", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_COST);
    const User = await db.users.create({
      email: req.body.email,
      password: hashedPassword,
    });
    console.log("User created");
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

module.exports = router;
