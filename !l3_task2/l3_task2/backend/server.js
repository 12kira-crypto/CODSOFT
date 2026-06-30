/**
 * server.js
 * -------------------------------------------------------------------------
 * Entry point. Unlike a Mongo-backed app, there's no async DB connection
 * to await before listening — the JSON file store reads/creates its file
 * lazily on first access — so startup is just wiring middleware + routes.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");
const { _internal } = require("./db/jsonStore");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", store: "json-file", dbPath: _internal.DB_PATH });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler (catches anything thrown synchronously)
app.use((err, req, res, next) => {
  console.error("[Unhandled error]", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Project Management API listening on port ${PORT}`);
  console.log(`Using JSON file store at: ${_internal.DB_PATH}`);
});

module.exports = app;
