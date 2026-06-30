/**
 * routes/projects.js
 * -------------------------------------------------------------------------
 * CRUD for projects, scoped to the authenticated user (owner or member).
 * Each project response includes a computed `progress` block derived from
 * its tasks via utils/progress.js.
 */

const express = require("express");
const { projects, tasks, users } = require("../db/jsonStore");
const { auth } = require("../middleware/auth");
const { calculateProgress } = require("../utils/progress");

const router = express.Router();
router.use(auth);

async function attachProgress(project) {
  const projectTasks = await tasks.find((t) => t.projectId === project.id);
  return { ...project, progress: calculateProgress(projectTasks) };
}

function isMember(project, userId) {
  return project.ownerId === userId || (project.memberIds || []).includes(userId);
}

// GET /api/projects  — all projects the user owns or is a member of
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const list = await projects.find((p) => isMember(p, userId));
    const withProgress = await Promise.all(list.map(attachProgress));
    res.json({ projects: withProgress });
  } catch (err) {
    console.error("[GET /projects]", err);
    res.status(500).json({ message: "Server error fetching projects" });
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const project = await projects.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!isMember(project, req.user.id)) {
      return res.status(403).json({ message: "You do not have access to this project" });
    }
    res.json({ project: await attachProgress(project) });
  } catch (err) {
    console.error("[GET /projects/:id]", err);
    res.status(500).json({ message: "Server error fetching project" });
  }
});

// POST /api/projects
router.post("/", async (req, res) => {
  try {
    const { name, description, dueDate, memberIds } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await projects.insert({
      name,
      description: description || "",
      dueDate: dueDate || null,
      ownerId: req.user.id,
      memberIds: Array.isArray(memberIds) ? memberIds : [],
    });

    res.status(201).json({ project: await attachProgress(project) });
  } catch (err) {
    console.error("[POST /projects]", err);
    res.status(500).json({ message: "Server error creating project" });
  }
});

// PUT /api/projects/:id
router.put("/:id", async (req, res) => {
  try {
    const project = await projects.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Only the owner can edit this project" });
    }

    const { name, description, dueDate, memberIds } = req.body;
    const updated = await projects.updateById(project.id, {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(dueDate !== undefined && { dueDate }),
      ...(memberIds !== undefined && { memberIds }),
    });

    res.json({ project: await attachProgress(updated) });
  } catch (err) {
    console.error("[PUT /projects/:id]", err);
    res.status(500).json({ message: "Server error updating project" });
  }
});

// DELETE /api/projects/:id  — cascades to its tasks
router.delete("/:id", async (req, res) => {
  try {
    const project = await projects.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Only the owner can delete this project" });
    }

    await tasks.deleteMany((t) => t.projectId === project.id);
    await projects.deleteById(project.id);

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("[DELETE /projects/:id]", err);
    res.status(500).json({ message: "Server error deleting project" });
  }
});

module.exports = router;
