import axios from 'axios'

const workerApi = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_WORKER_API_URL,
  withCredentials: true,
})

export async function createProgramRequest({ name, projects }) {
  const { data } = await workerApi.post('/api/programs', { name, projects })
  return data
}

export async function listProgramsRequest() {
  const { data } = await workerApi.get('/api/programs')
  return data
}
