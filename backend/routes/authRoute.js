const express = require("express");
const auth = require('../middleware/auth')
const adminOnly = require('../middleware/roles')
const { register, login, getProfile, banUserByAdmin } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me",auth,getProfile)
router.put("/ban-user/:id",auth,adminOnly,banUserByAdmin)

module.exports = router;
