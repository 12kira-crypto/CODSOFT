/**
 * utils/progress.js
 * -------------------------------------------------------------------------
 * Computes a project's completion progress from its tasks.
 * Progress = percentage of tasks whose status is "done".
 */

function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) {
    return { percent: 0, total: 0, done: 0, inProgress: 0, todo: 0 };
  }

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;

  return {
    percent: Math.round((done / total) * 100),
    total,
    done,
    inProgress,
    todo,
  };
}

module.exports = { calculateProgress };
