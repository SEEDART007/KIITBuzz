const mongoose = require('mongoose')

const blogPostSchema = new mongoose.Schema({
  
  // Core post data
  title: {
    type: String,
    required: true,
    maxlength: 150
  },

  content: {
    type: String,
    required: true
  },

  // Author (never public)
  authorEmail: {
    type: String,
    required: true,
    index: true
  },

  // Public identity (shown on post)
  authorTag: {
    type: String,   // e.g. "CSE 3rd Year"
    required: true
  },

  // For filtering feeds
  department: {
    type: String,   // CSE, ECE, MECH, etc
    index: true
  },

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  year: {
    type: String,   // "1st", "2nd", "3rd", "Final"
    index: true
  },

  // Type of post
  category: {
    type: String,
    enum: [
      "general",
      "course_review",
      "professor_review",
      "exam_tip",
      "confession",
      "internship",
      "event",
      "notes"
    ],
    index: true
  },

  // Engagement
  upvotes: {
    type: Number,
    default: 0
  },
 upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  commentsCount: {
    type: Number,
    default: 0
  },

  // Hotness algorithm helpers
  views: {
    type: Number,
    default: 0
  },

  // If moderators hide it
  isHidden: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });   // adds createdAt, updatedAt

const Blog =  mongoose.model("BlogPost", blogPostSchema);
module.exports = Blog;
