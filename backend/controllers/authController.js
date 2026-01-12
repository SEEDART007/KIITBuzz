const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* REGISTER */
const register = async (req, res) => {
  try {
    const { email, password, department, year } = req.body;

    if (!email.endsWith("@kiit.ac.in")) {
      return res.status(403).json({ msg: "Only university emails allowed" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash: hash,
      department,
      year
    });

    // Generate token immediately
    const token = jwt.sign(
      {
        email: user.email,
        department: user.department,
        year: user.year
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

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      {
        email: user.email,
        department: user.department,
        year: user.year
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { register, login };
