import axios from "axios";

export const SESSION_INVALID = "session_invalid";

const workerApi = axios.create({
  baseURL: import.meta.env.VITE_WORKER_API_URL || "http://localhost:8787",
  withCredentials: true,
});

let onSessionInvalid = null;
let handlingSessionInvalid = false;

export function isSessionInvalidError(error) {
  return error?.response?.data?.error === SESSION_INVALID;
}

export function setSessionInvalidHandler(handler) {
  onSessionInvalid = handler;
}

export function resetSessionInvalidGuard() {
  handlingSessionInvalid = false;
}

workerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isSessionInvalidError(error) && onSessionInvalid && !handlingSessionInvalid) {
      handlingSessionInvalid = true;
      Promise.resolve(onSessionInvalid()).catch(() => {});
    }
    return Promise.reject(error);
  },
);

export default workerApi;
