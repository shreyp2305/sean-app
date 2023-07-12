const express = require("express");
const multer = require('multer');
const router = express.Router();
const db = require("../models/index");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage(
  {
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let err = new Error('Invalid mime type');
      cb(null, "./backend/assets/post_images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + Date.now() + '.' + ext);
    }
  }
);

// handles post requests
router.post('', multer({storage: storage}).single("image"), async (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  if (req.filename) {
    const post = await db.posts.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      imagePath: url + '/images/' + req.file.filename
    }).then( createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        postId: createdPost.id,
        imagePath: createdPost.imagePath
      })
    });
  }
  else {
    const post = await db.posts.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      imagePath: ''
    }).then( createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        postId: createdPost.id,
        imagePath: createdPost.imagePath
      })
    });
  }

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
