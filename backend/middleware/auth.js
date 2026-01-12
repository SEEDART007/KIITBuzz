require('dotenv').config()
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { email, department, year }
    next(); 
  } catch {
    res.status(401).json({ msg: "Unauthorized" });
  }
}

module.exports = auth;
