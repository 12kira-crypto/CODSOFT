import axiosClient from "./axiosClient";

export const register = (payload) =>
  axiosClient.post("/auth/register", payload).then((res) => res.data);

export const login = (payload) =>
  axiosClient.post("/auth/login", payload).then((res) => res.data);

export const getMe = () =>
  axiosClient.get("/auth/me").then((res) => res.data);
