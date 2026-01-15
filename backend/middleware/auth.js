const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

const auth = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Malformed token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-passwordHash");
    console.log(decoded._id)

    if (!user) {
      return res.status(401).json({ msg: "Use not found" });
    }

    // 🔐 Block banned users
    if (user.isBanned) {
      return res.status(403).json({
        msg: "Your account has been banned",
        reason: user.banReason
      });
    }

    // decoded MUST contain _id
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

module.exports = auth;
