const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");

function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: String(userId),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name?.trim() || "",
    email: normalizedEmail,
    passwordHash,
    role: "user"
  });

  return res.status(201).json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user._id);

  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});

const me = asyncHandler(async (req, res) => {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name
      }
    });
  });
  

  module.exports = { register, login, me };

