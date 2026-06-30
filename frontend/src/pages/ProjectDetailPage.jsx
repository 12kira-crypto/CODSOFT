import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as projectsApi from "../api/projectsApi";
import { useTasks } from "../hooks/useTasks";
import PaceRing from "../components/projects/ProgressBar";
import ProjectForm from "../components/projects/ProjectForm";
import TaskList from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";
import { formatDate } from "../utils/formatDate";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [error, setError] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks, loading: loadingTasks, addTask, editTask, removeTask, reload: reloadTasks } =
    useTasks(id);

  const loadProject = useCallback(async () => {
    setLoadingProject(true);
    setError("");
    try {
      const data = await projectsApi.fetchProject(id);
      setProject(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load this project");
    } finally {
      setLoadingProject(false);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Re-sync the project's progress ring whenever the task list changes.
  useEffect(() => {
    if (!loadingTasks) loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks.length]);

  async function handleStatusChange(task, status) {
    await editTask(task.id, { status });
    loadProject();
  }

  async function handleDeleteTask(task) {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    await removeTask(task.id);
    loadProject();
  }

  async function handleDeleteProject() {
    if (!window.confirm(`Delete project "${project.name}"? This also deletes its tasks.`)) return;
    await projectsApi.deleteProject(project.id);
    navigate("/");
  }

  function openEditTask(task) {
    setEditingTask(task);
    setShowTaskForm(true);
  }

  function closeTaskForm() {
    setShowTaskForm(false);
    setEditingTask(null);
  }

  async function submitTask(payload) {
    if (editingTask) {
      await editTask(editingTask.id, payload);
    } else {
      await addTask(payload);
    }
    loadProject();
  }

  if (loadingProject) {
    return <div className="loading-row">Loading project…</div>;
  }

  if (error || !project) {
    return (
      <div className="form-error">
        {error || "Project not found"}{" "}
        <Link to="/" style={{ color: "inherit" }}>
          Back to projects
        </Link>
      </div>
    );
  }

  const progress = project.progress || { percent: 0, total: 0, done: 0 };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Projects
            </Link>{" "}
            / {project.name}
          </div>
          <h1 className="page-title">{project.name}</h1>
          {project.description && <p className="page-sub">{project.description}</p>}
        </div>
        <div className="toolbar">
          <button className="btn btn-ghost" onClick={() => setShowProjectForm(true)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDeleteProject}>
            Delete
          </button>
        </div>
      </div>

      <div className="project-header-card">
        <div className="project-header-stats">
          <div className="stat">
            <span className="stat-value">{progress.total}</span>
            <span className="stat-label">Tasks</span>
          </div>
          <div className="stat">
            <span className="stat-value">{progress.done}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="stat">
            <span className="stat-value">{formatDate(project.dueDate)}</span>
            <span className="stat-label">Due date</span>
          </div>
        </div>
        <PaceRing percent={progress.percent} size={72} stroke={6} />
      </div>

      <div className="page-header" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18 }}>Tasks</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowTaskForm(true)}>
          + New task
        </button>
      </div>

      {loadingTasks ? (
        <div className="loading-row">Loading tasks…</div>
      ) : (
        <TaskList
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onEdit={openEditTask}
          onDelete={handleDeleteTask}
        />
      )}

      {showProjectForm && (
        <ProjectForm
          initialValues={project}
          onSubmit={(payload) => projectsApi.updateProject(project.id, payload).then(loadProject)}
          onClose={() => setShowProjectForm(false)}
        />
      )}

      {showTaskForm && (
        <TaskForm initialValues={editingTask} onSubmit={submitTask} onClose={closeTaskForm} />
      )}
    </>
  );
}
