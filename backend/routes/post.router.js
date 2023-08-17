const express = require("express");
const multer = require("multer");
const router = express.Router();
const db = require("../models/index");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error("Invalid mime type");
    cb(null, "./backend/assets/post_images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// handles post requests
router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  async (req, res, next) => {
    // const url = req.protocol + "://" + req.get("host");
    const post = await db.posts
      .create({
        title: req.body.title,
        content: req.body.content,
        imagePath: req.file ? "/images/" + req.file.filename : "",
      })
      .then((createdPost) => {
        res.status(201).json({
          message: "Post added successfully",
          postId: createdPost.id,
          imagePath: createdPost.imagePath,
        });
      });
  }
);

// handles get requests
router.get("", async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const options = {};
  if (pageSize && currentPage) {
    options["offset"] = pageSize * (currentPage - 1);
    options["limit"] = pageSize;
  }
  let fetchedPosts = [];

  await db.posts
    .findAll(options)
    .then((data) => {
      fetchedPosts = data;
      return db.posts.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
});

// handles delete requests
router.delete("/:id", checkAuth, async (req, res, next) => {
  const deletedPost = db.posts
    .destroy({
      where: { id: req.params.id },
    })
    .then((data) => {
      res.status(200).json({ message: "Post deleted!" });
    });
});

module.exports = router;
