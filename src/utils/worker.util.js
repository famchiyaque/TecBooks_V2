import axios from "axios";

const workerApi = axios.create({
  baseURL: import.meta.env.VITE_WORKER_API_URL || "http://localhost:8787",
  withCredentials: true,
});

export default workerApi;
