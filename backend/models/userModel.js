const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z0-9_]+$/ // letters, numbers, underscore only
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  avatar: { type: String, required: true },

   role: { type: String, enum: ["user", "admin"], default: "user" },
   isBanned: {
    type: Boolean,
    default: false,
    index: true
  },
  banReason: {
    type: String,
    trim: true,
    maxlength: 300
  },
  bannedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
