const BlogPost = require("../models/blogModel");

/* Create Post */
const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const authorTag = `${req.user.department} ${req.user.year}`;

    const post = await BlogPost.create({
      title,
      content,
      category,
      authorEmail: req.user.email,
      authorTag,
      department: req.user.department,
      year: req.user.year
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

/* Get Feed */
const getFeed = async (req, res) => {
  try {
    const { department, year, category } = req.query;

    let filter = { isHidden: false };
    if (department) filter.department = department;
    if (year) filter.year = year;
    if (category) filter.category = category;

    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* Get Single Post */
const getPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post || post.isHidden) return res.status(404).json({ msg: "Not found" });

    post.views += 1;
    await post.save();

    res.json(post);
  } catch {
    res.status(404).json({ msg: "Not found" });
  }
};

/* Upvote */
const upvotePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const userEmail = req.user.email;

    // Check if user already upvoted
    if (post.upvotedBy.includes(userEmail)) {
      return res.status(400).json({ msg: "You already upvoted this post" });
    }

    // Increment upvotes and add user to upvotedBy
    post.upvotes += 1;
    post.upvotedBy.push(userEmail);
    await post.save();

    res.json({ upvotes: post.upvotes });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

/* Delete own post */
const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Not found" });

    if (post.authorEmail !== req.user.email)
      return res.status(403).json({ msg: "Not your post" });

    await post.deleteOne();
    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

module.exports = { createPost, getFeed, getPost, upvotePost, deletePost };
