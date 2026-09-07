import axios from 'axios'

const workerApi = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_WORKER_API_URL,
  withCredentials: true,
})

export async function createProgramRequest({ name, projects, files }) {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('projects', JSON.stringify(projects))
  for (const file of files) {
    formData.append('files', file)
  }
  const { data } = await workerApi.post('/api/programs', formData)
  return data
}

export async function listProgramsRequest() {
  const { data } = await workerApi.get('/api/programs')
  return data
}
