import axios from 'axios'

const workerApi = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_WORKER_API_URL,
  withCredentials: true,
})

export async function loginRequest(email, password) {
  const { data } = await workerApi.post('/api/auth/login', { email, password })
  return data
}

export async function registerRequest({ email, password, first_name, last_name }) {
  const { data } = await workerApi.post('/api/auth/register', { email, password, first_name, last_name })
  return data
}

export async function logoutRequest() {
  const { data } = await workerApi.post('/api/auth/logout')
  return data
}
