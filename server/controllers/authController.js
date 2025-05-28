const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });
    await newUser.save();

    res.status(200).json({ msg: "Registration successfull" });
  } catch (err) {
    res.status(500).json({ msg: err.msg });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = User.findOne({ email });

    if (!existing) return res.status(400).json({ msg: "User do no exist!" });

    const hashed = await bcrypt.hash(password, 10);

    res.status(200).json({ msg: "Login Successfull!" });
  } catch (err) {
    res.status(500).json({ msg: err.msg });
  }
};
