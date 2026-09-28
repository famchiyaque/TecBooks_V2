import workerApi from '@/utils/worker.util'

/** { [tableKey]: [{ rowId, label, values: { [year]: value } }] } for every editable table's custom rows. */
export async function getTableRowsRequest(gameId) {
  const { data } = await workerApi.get(`/api/feasibility/${gameId}/rows`)
  return data
}

/** Atomic replace of one table's custom-row set - rows: [{ rowId, label, values }]. */
export async function replaceTableRowsRequest(gameId, tableKey, rows) {
  const { data } = await workerApi.put(`/api/feasibility/${gameId}/rows/${tableKey}`, { rows })
  return data
}

export async function deleteTableRowRequest(gameId, tableKey, rowId) {
  const { data } = await workerApi.delete(`/api/feasibility/${gameId}/rows/${tableKey}/${rowId}`)
  return data
}
