import axiosClient from "./axiosClient";

export const fetchProjects = () =>
  axiosClient.get("/projects").then((res) => res.data.projects);

export const fetchProject = (id) =>
  axiosClient.get(`/projects/${id}`).then((res) => res.data.project);

export const createProject = (payload) =>
  axiosClient.post("/projects", payload).then((res) => res.data.project);

export const updateProject = (id, payload) =>
  axiosClient.put(`/projects/${id}`, payload).then((res) => res.data.project);

export const deleteProject = (id) =>
  axiosClient.delete(`/projects/${id}`).then((res) => res.data);
