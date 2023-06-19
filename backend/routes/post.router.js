const express = require("express");
const router = express.Router();
const db = require("../models/index");


// handles post requests
router.post('', async (req, res, next) => {
  console.log('request received');
  const post = await db.posts.create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  }).then( createdPost => {
    res.status(201).json({
      message: "Post added successfully",
    })
  });
});

// handles get requests
router.get('', async (req, res, next) => {
  const all_posts = await db.posts.findAll()
    .then( (data) => {res.status(200).json({
      message: "Posts fetched successfully!",
      posts: data
    })
    })
});


module.exports = router;
