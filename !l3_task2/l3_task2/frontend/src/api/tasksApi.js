import axiosClient from "./axiosClient";

export const fetchTasks = (projectId) =>
  axiosClient.get("/tasks", { params: { projectId } }).then((res) => res.data.tasks);

export const createTask = (payload) =>
  axiosClient.post("/tasks", payload).then((res) => res.data.task);

export const updateTask = (id, payload) =>
  axiosClient.put(`/tasks/${id}`, payload).then((res) => res.data.task);

export const deleteTask = (id) =>
  axiosClient.delete(`/tasks/${id}`).then((res) => res.data);
