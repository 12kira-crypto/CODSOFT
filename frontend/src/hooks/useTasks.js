import { useState, useEffect, useCallback } from "react";
import * as tasksApi from "../api/tasksApi";

export function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    try {
      const data = await tasksApi.fetchTasks(projectId);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTask = useCallback(
    async (payload) => {
      const task = await tasksApi.createTask({ ...payload, projectId });
      setTasks((prev) => [...prev, task]);
      return task;
    },
    [projectId]
  );

  const editTask = useCallback(async (id, payload) => {
    const updated = await tasksApi.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTask = useCallback(async (id) => {
    await tasksApi.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, loading, error, reload, addTask, editTask, removeTask };
}
