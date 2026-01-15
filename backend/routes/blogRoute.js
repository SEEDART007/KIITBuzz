const express = require('express')
const auth = require('../middleware/auth')
const adminOnly = require('../middleware/roles')
const {
  createPost,
  getFeed,
  getPost,
  upvotePost,
  deletePost,
  adminDeleteBlog,
  getAllPostsByAdmin
} =  require("../controllers/blogController");

const router = express.Router();

//get all posts by admin 
router.get("/get-posts",auth,adminOnly,getAllPostsByAdmin)
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

//delete by admin
router.delete("/delete-post/:id", auth, adminOnly, adminDeleteBlog)


module.exports = router;