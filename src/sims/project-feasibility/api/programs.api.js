import axios from 'axios'
import { Logger } from '../utils/logger.js'

const logger = new Logger('ProgramsApi')

const workerApi = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_WORKER_API_URL,
  withCredentials: true,
})

workerApi.interceptors.request.use((config) => {
  logger.debug(`-> ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

workerApi.interceptors.response.use(
  (response) => {
    logger.debug(`<- ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    logger.error(`<- ${error.response?.status ?? 'network error'} ${error.config?.url}`, error.response?.data ?? error.message)
    return Promise.reject(error)
  },
)

export async function createProgramRequest({ name, projects, files }) {
  return logger.time(`createProgramRequest(${name})`, async () => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('projects', JSON.stringify(projects))
    for (const file of files) {
      formData.append('files', file)
    }
    const { data } = await workerApi.post('/api/programs', formData)
    return data
  })
}

export async function listProgramsRequest() {
  return logger.time('listProgramsRequest', async () => {
    const { data } = await workerApi.get('/api/programs')
    return data
  })
}
