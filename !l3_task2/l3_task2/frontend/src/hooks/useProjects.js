import { useState, useEffect, useCallback } from "react";
import * as projectsApi from "../api/projectsApi";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await projectsApi.fetchProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addProject = useCallback(async (payload) => {
    const project = await projectsApi.createProject(payload);
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const editProject = useCallback(async (id, payload) => {
    const updated = await projectsApi.updateProject(id, payload);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const removeProject = useCallback(async (id) => {
    await projectsApi.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { projects, loading, error, reload, addProject, editProject, removeProject };
}
