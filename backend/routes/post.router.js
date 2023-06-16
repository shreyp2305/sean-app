const express = require("express");
const router = express.Router();
const db = require("../models/index");


// handles post requests
router.post("/api/posts", (req, res, next) => {
  const posts = req.body;
  console.log(posts);
  res.status(201).json({
    message: "Post added succuesfully",
  });
});

// handles get requests
router.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "adfs87ej",
      title: "First server-side post",
      content: "This is coming from the server",
    },
    {
      id: "wiu3f8hw",
  title: "Second serve-side post",
      content: "This is also coming from the server",
    },
  ];
  return res.status(200).json({
    message: "Post fetched successfully",
    posts: posts,
  });
});


module.exports = router;
