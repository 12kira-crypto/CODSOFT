/**
 * routes/tasks.js
 * -------------------------------------------------------------------------
 * CRUD for tasks. Tasks always belong to a project; access is gated by
 * project membership (owner or member).
 */

const express = require("express");
const { tasks, projects } = require("../db/jsonStore");
const { auth } = require("../middleware/auth");

const router = express.Router();
router.use(auth);

const VALID_STATUSES = ["todo", "in-progress", "done"];

function isMember(project, userId) {
  return project.ownerId === userId || (project.memberIds || []).includes(userId);
}

async function assertProjectAccess(projectId, userId) {
  const project = await projects.findById(projectId);
  if (!project) return { error: 404, message: "Project not found" };
  if (!isMember(project, userId)) return { error: 403, message: "You do not have access to this project" };
  return { project };
}

// GET /api/tasks?projectId=...  — list tasks for a project
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: "projectId query param is required" });

    const access = await assertProjectAccess(projectId, req.user.id);
    if (access.error) return res.status(access.error).json({ message: access.message });

    const list = await tasks.find((t) => t.projectId === projectId);
    res.json({ tasks: list });
  } catch (err) {
    console.error("[GET /tasks]", err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

// GET /api/tasks/:id
router.get("/:id", async (req, res) => {
  try {
    const task = await tasks.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const access = await assertProjectAccess(task.projectId, req.user.id);
    if (access.error) return res.status(access.error).json({ message: access.message });

    res.json({ task });
  } catch (err) {
    console.error("[GET /tasks/:id]", err);
    res.status(500).json({ message: "Server error fetching task" });
  }
});

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { projectId, title, description, assigneeId, dueDate, status } = req.body;
    if (!projectId || !title) {
      return res.status(400).json({ message: "projectId and title are required" });
    }

    const access = await assertProjectAccess(projectId, req.user.id);
    if (access.error) return res.status(access.error).json({ message: access.message });

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const task = await tasks.insert({
      projectId,
      title,
      description: description || "",
      assigneeId: assigneeId || null,
      dueDate: dueDate || null,
      status: status || "todo",
      createdBy: req.user.id,
    });

    res.status(201).json({ task });
  } catch (err) {
    console.error("[POST /tasks]", err);
    res.status(500).json({ message: "Server error creating task" });
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const task = await tasks.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const access = await assertProjectAccess(task.projectId, req.user.id);
    if (access.error) return res.status(access.error).json({ message: access.message });

    const { title, description, assigneeId, dueDate, status } = req.body;
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const updated = await tasks.updateById(task.id, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(assigneeId !== undefined && { assigneeId }),
      ...(dueDate !== undefined && { dueDate }),
      ...(status !== undefined && { status }),
    });

    res.json({ task: updated });
  } catch (err) {
    console.error("[PUT /tasks/:id]", err);
    res.status(500).json({ message: "Server error updating task" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const task = await tasks.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const access = await assertProjectAccess(task.projectId, req.user.id);
    if (access.error) return res.status(access.error).json({ message: access.message });

    await tasks.deleteById(task.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("[DELETE /tasks/:id]", err);
    res.status(500).json({ message: "Server error deleting task" });
  }
});

module.exports = router;
