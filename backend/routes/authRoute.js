const express = require("express");
const auth = require('../middleware/auth')
const adminOnly = require('../middleware/roles')
const { register, login, getProfile, banUserByAdmin, getAllUsersByAdmin } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me",auth,getProfile)
router.put("/ban-user/:id",auth,adminOnly,banUserByAdmin)
router.get("/getAll",auth,adminOnly,getAllUsersByAdmin)

module.exports = router;
