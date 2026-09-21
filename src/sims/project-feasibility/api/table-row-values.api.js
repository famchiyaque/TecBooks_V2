import workerApi from '@/utils/worker.util'
import { Logger } from '../utils/logger.js'

const logger = new Logger('TableRowValuesApi')

export async function getTableRowValuesRequest(gameId, type) {
  return logger.time(`getTableRowValues(${gameId}, ${type})`, async () => {
    const { data } = await workerApi.get(`/api/table-row-values/${gameId}/${type}`)
    return data.rows
  })
}

export async function replaceTableRowValuesRequest(gameId, type, rows) {
  return logger.time(`replaceTableRowValues(${gameId}, ${type})`, async () => {
    const { data } = await workerApi.put(`/api/table-row-values/${gameId}/${type}`, { rows })
    return data.rows
  })
}
