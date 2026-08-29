import axios from 'axios'

const workerApi = axios.create({
  baseURL: import.meta.env.VITE_WORKER_API_URL || 'http://localhost:8787',
  withCredentials: true,
})

export async function createProgramRequest({ name, projects }) {
  const { data } = await workerApi.post('/api/programs', { name, projects })
  return data
}
