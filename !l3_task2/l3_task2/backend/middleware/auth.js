/**
 * middleware/auth.js
 * -------------------------------------------------------------------------
 * JWT auth middleware. Identical contract to a Mongo-backed version:
 * verifies the bearer token, loads the user from the file store, and
 * attaches a trimmed `req.user` (no password hash) to the request.
 */

const jwt = require("jsonwebtoken");
const { users } = require("../db/jsonStore");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }

    const user = await users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    console.error("[auth middleware] error:", err);
    res.status(500).json({ message: "Server error during authentication" });
  }
}

module.exports = { auth, JWT_SECRET };
