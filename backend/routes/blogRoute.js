const express = require('express')
const auth = require('../middleware/auth')
const {
  createPost,
  getFeed,
  getPost,
  upvotePost,
  deletePost
} =  require("../controllers/blogController");

const router = express.Router();

// Create a new post
router.post("/",auth, createPost);

// Get feed (filters: department, year, category)
router.get("/",  getFeed);

// Get single post
router.get("/:id", auth,  getPost);

// Upvote
router.post("/:id/upvote", auth,  upvotePost);

// Delete own post
router.delete("/:id",auth,  deletePost);

module.exports = router;