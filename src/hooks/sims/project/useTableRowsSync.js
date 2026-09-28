import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useTableRows from './useTableRows.js'
import { replaceTableRowsRequest } from '@/sims/project-feasibility/api/rows.api.js'

const SAVE_DEBOUNCE_MS = 800

/**
 * Keeps one EditableTableSlice's custom rows in sync with D1 (row_table):
 * hydrates from the server once per mount (see EditableTableSlice.hydrate),
 * then PUTs the full row set back whenever it changes locally - add/remove/
 * edit label/edit value - debounced so typing into a cell doesn't fire one
 * request per keystroke. D1 stays the source of truth; Redux is only the
 * in-session edit buffer (see technical-debt.md - don't revive Redux as a
 * session CBM database).
 */
export default function useTableRowsSync(gameId, slice, tableKey) {
  const dispatch = useDispatch()
  const { data } = useTableRows(gameId)
  const customRows = useSelector(slice.selectCustomRows)
  const hydrated = useRef(false)
  const saveTimer = useRef(null)

  // Load once: applying the server's rows changes customRows too, but the
  // `hydrated` guard below (set BEFORE dispatching) keeps that first change
  // from immediately triggering a save-effect PUT of the same data.
  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true
    dispatch(slice.actions.hydrate(data[tableKey] ?? []))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (!hydrated.current) return
    if (!Number.isInteger(gameId) || gameId < 1) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      replaceTableRowsRequest(
        gameId,
        tableKey,
        customRows.map((row) => ({ rowId: row.id, label: row.label, values: row.values }))
      )
    }, SAVE_DEBOUNCE_MS)
    return () => clearTimeout(saveTimer.current)
  }, [customRows, gameId, tableKey])
}
