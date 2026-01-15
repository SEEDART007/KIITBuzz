const BlogPost = require("../models/blogModel");
const mongoose = require("mongoose")


/* Create Post */
const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const user = req.user;
    const authorTag = `${req.user.department} ${req.user.year}`;

    const post = await BlogPost.create({
      title,
      content,
      category,
      author: user._id,
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
// const getFeed = async (req, res) => {
//   try {
//     const { department, year, category } = req.query;

//     let filter = { isHidden: false };
//     if (department) filter.department = department;
//     if (year) filter.year = year;
//     if (category) filter.category = category;

//     const posts = await BlogPost.find(filter)
//       .sort({ createdAt: -1 })
//       .limit(100);

//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// GET /blogs?page=1&limit=10
const getFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const lastId = req.query.lastId;

    let filter = { isHidden: false };
    if (lastId) filter._id = { $lt: lastId }; // fetch older posts for infinite scroll

    const posts = await BlogPost.find(filter)
      .sort({ _id: -1 }) // newest first
      .limit(limit)
      .populate("author", "avatar department year"); // fetch author avatar and info

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
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid post ID" });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);

    const post = await BlogPost.findOneAndUpdate(
      {
        _id: req.params.id,
        upvotedBy: { $ne: userId }
      },
      {
        $inc: { upvotes: 1 },
        $addToSet: { upvotedBy: userId }
      },
      { new: true }
    );

    if (!post) {
      return res
        .status(400)
        .json({ msg: "Already upvoted or post not found" });
    }

    res.json({ upvotes: post.upvotes });
  } catch (err) {
    console.error("UPVOTE ERROR:", err.message);
    res.status(500).json({ msg: "Internal server error" });
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


const adminDeleteBlog = async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "post deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getAllPostsByAdmin = async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .populate("author", "email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createPost, getFeed, getPost, upvotePost, deletePost, adminDeleteBlog, getAllPostsByAdmin };
