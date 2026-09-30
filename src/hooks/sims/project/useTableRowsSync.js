import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useTableRows from './useTableRows.js'
import { replaceTableRowsRequest } from '@/sims/project-feasibility/api/rows.api.js'

const SAVE_DEBOUNCE_MS = 800

/**
 * Keeps one EditableTableSlice's custom rows in sync with D1 (row_table):
 * hydrates from the server once per project (see EditableTableSlice.hydrate),
 * then PUTs the full row set back whenever it changes locally - add/remove/
 * edit label/edit value - debounced so typing into a cell doesn't fire one
 * request per keystroke. D1 stays the source of truth; Redux is only the
 * in-session edit buffer (see technical-debt.md - don't revive Redux as a
 * session CBM database).
 *
 * Two navigation hazards this guards, both of which silently lost rows:
 *
 * 1. The edit buffer is a store that ProjectDashboard recreates per project
 *    (useMemo keyed on project.id), so switching projects in the sidebar
 *    throws the in-memory rows away. If a pending debounced write was still
 *    in flight it died with them, and the row existed nowhere. So the pending
 *    payload is held in a ref and FLUSHED when the project changes or the
 *    component unmounts - never just cancelled.
 * 2. The hydrate guard used to be a plain boolean ref, which only resets on
 *    unmount. Changing project does NOT unmount these tables (same route, only
 *    params change, and useFeasibilityModel caches so isPending stays false),
 *    so the new project never hydrated - and the save effect then fired with
 *    the fresh store's empty customRows. Since replaceRowsForTable is
 *    DELETE-then-INSERT, that empty PUT ERASED the destination project's saved
 *    rows. The guard is now `hydratedFor === gameId`, and no write is allowed
 *    out until the project it targets has actually been hydrated.
 *
 * `fallbackRows` (server-shape: `[{ rowId, label, values }]`) is what hydrate
 * installs when the server genuinely has nothing saved for this table. A
 * table whose total feeds a ratio can't just hydrate to `[]` in that case -
 * the first paint would already divide by zero. Doing it here rather than in
 * a separate seeding effect is what makes it race-free: hydrate is the single
 * place that owns "replace customRows wholesale", so nothing can wipe the
 * fallback afterwards. Optional - tables with nothing to fall back to (the
 * default) behave exactly as before.
 */
export default function useTableRowsSync(gameId, slice, tableKey, { fallbackRows } = {}) {
  const dispatch = useDispatch()
  const { data } = useTableRows(gameId)
  const customRows = useSelector(slice.selectCustomRows)
  const hydratedFor = useRef(null)
  const saveTimer = useRef(null)
  const pendingSave = useRef(null)

  // Load once per project: applying the server's rows changes customRows too,
  // so `hydratedFor` is set BEFORE dispatching and the save effect below stays
  // blocked for any project that hasn't been hydrated yet.
  useEffect(() => {
    if (!data || hydratedFor.current === gameId) return
    hydratedFor.current = gameId
    const saved = data[tableKey] ?? []
    dispatch(slice.actions.hydrate(saved.length > 0 ? saved : (fallbackRows ?? [])))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, gameId])

  useEffect(() => {
    // Never write to a project whose rows haven't landed in Redux yet - the
    // store starts empty, and an empty PUT is a DELETE (see the header).
    if (hydratedFor.current !== gameId) return
    if (!Number.isInteger(gameId) || gameId < 1) return
    clearTimeout(saveTimer.current)
    const payload = customRows.map((row) => ({ rowId: row.id, label: row.label, values: row.values }))
    pendingSave.current = { gameId, tableKey, payload }
    saveTimer.current = setTimeout(() => {
      pendingSave.current = null
      replaceTableRowsRequest(gameId, tableKey, payload)
    }, SAVE_DEBOUNCE_MS)
    // Debounce only - NOT a flush. Flushing here would fire on every keystroke,
    // since this cleanup also runs when customRows changes. The flush lives in
    // the [gameId] effect below.
    return () => clearTimeout(saveTimer.current)
  }, [customRows, gameId, tableKey])

  // Flush the pending write when leaving a project or unmounting. Deps are
  // [gameId] so this cleanup runs exactly twice: once per project switch, and
  // once on unmount - never on a routine edit. It sends the payload captured
  // when the timer was armed, so it always targets the project being LEFT.
  useEffect(() => {
    return () => {
      const pending = pendingSave.current
      if (!pending) return
      pendingSave.current = null
      // `gameId` here is still the one being LEFT, so a payload already re-armed
      // for the incoming project is skipped rather than being sent on its
      // behalf. The save effect has its own debounce and will handle that one.
      if (pending.gameId !== gameId) return
      replaceTableRowsRequest(pending.gameId, pending.tableKey, pending.payload)
    }
  }, [gameId])
}
