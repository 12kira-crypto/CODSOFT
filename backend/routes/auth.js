/**
 * routes/auth.js
 * -------------------------------------------------------------------------
 * Register / login / current-user endpoints. Same API shape as the
 * Mongo-backed version: POST /api/auth/register, POST /api/auth/login,
 * GET /api/auth/me.
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users } = require("../db/jsonStore");
const { auth, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
}

function sanitize(user) {
  const { password, ...safe } = user;
  return safe;
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await users.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await users.insert({ name, email: email.toLowerCase(), password: hashed });

    const token = signToken(user);
    res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    console.error("[POST /auth/register]", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await users.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({ token, user: sanitize(user) });
  } catch (err) {
    console.error("[POST /auth/login]", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
