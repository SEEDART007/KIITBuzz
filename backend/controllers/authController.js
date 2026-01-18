const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const avatars = [
  "/avatars/1.png",
  "/avatars/2.png",
  "/avatars/3.png",
  "/avatars/4.png",
  "/avatars/5.png"
];



/* REGISTER */
const register = async (req, res) => {
  try {
    const { username,email, password, department, year,role } = req.body;
     const existingUsername = await User.findOne({ username });
if (existingUsername) {
  return res.status(400).json({ msg: "Username already taken" });
}
    if (!email.endsWith("@kiit.ac.in")) {
      return res.status(403).json({ msg: "Only university emails allowed" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    const user = await User.create({
      username,
      email,
      passwordHash: hash,
      department,
      year,
      avatar,
      role
    });

    // Generate token immediately
    const token = jwt.sign(
      {
         _id: user._id,
        email: user.email,
        department: user.department,
        year: user.year,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


/* LOGIN */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });
     
    if (user.isBanned) {
  return res.status(403).json({ msg: "Account is banned" });
}

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      {
         _id: user._id,
        email: user.email,
        department: user.department,
        year: user.year,
        role : user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
//currently not using
const updateProfile = async (req, res) => {
  const { department, year } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { department, year },
      { new: true }
    ).select("-passwordHash");
    res.json({ msg: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


const deleteUserByAdmin =  async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    console.log(id)
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: " not found" });
    }

    await user.deleteOne();

    res.json({
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const banUserByAdmin = async (req, res) => {
  try {
    const { reason } = req.body;
    const targetUserId = req.params.id;

    if (!reason || reason.trim().length < 3) {
      return res.status(400).json({ message: "Ban reason is required" });
    }

    // Prevent admin banning themselves
    if (req.user._id.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot ban yourself" });
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBanned) {
      return res.status(400).json({ message: "User is already banned" });
    }

    user.isBanned = true;
    user.banReason = reason;
    user.bannedAt = new Date();

    await user.save();

    res.json({
      message: "User banned successfully",
      user: {
        id: user._id,
        email: user.email,
        banReason: user.banReason,
        bannedAt: user.bannedAt
      }
    });

  } catch (err) {
    console.error("Ban error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsersByAdmin = async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { register, login,getProfile,deleteUserByAdmin, banUserByAdmin, getAllUsersByAdmin };
