import { configureStore, createSlice, nanoid } from '@reduxjs/toolkit'

/**
 * Reusable state for any "editable table": per-cell overrides on a fixed set
 * of rows, plus custom rows the user adds/removes. One instance per table
 * (e.g. `new EditableTableSlice('costTable', 'cost_table')`) - each gets its
 * own independent Redux slice/store, no collisions between tables.
 *
 * `type` is this table's identity against the `table-row-values` worker API
 * (GET/PUT `/api/table-row-values/:gameId/:type`) - see
 * worker/src/requests/table-row-values.request.js for the full whitelist.
 * Defaults to `name` when omitted.
 *
 * Usage:
 *   export const myTableSlice = new EditableTableSlice('myTable', 'my_table')
 *   const store = myTableSlice.createStore()          // own store per table instance
 *   <Provider store={store}><EditableTable slice={myTableSlice} .../></Provider>
 *
 * Or reuse an existing store by merging `{ [slice.name]: slice.reducer }`
 * into its reducer map (see costTable.store.js).
 */
export class EditableTableSlice {
  constructor(name, type = name) {
    this.name = name
    this.type = type

    this._slice = createSlice({
      name,
      initialState: { overrides: {}, customRows: [] },
      reducers: {
        setOverride: (state, action) => {
          const { rowKey, columnKey, value } = action.payload
          state.overrides[`${rowKey}:${columnKey}`] = value
        },
        addCustomRow: (state, action) => {
          state.customRows.push({ id: nanoid(), label: action.payload?.label ?? 'New row', values: {} })
        },
        removeCustomRow: (state, action) => {
          state.customRows = state.customRows.filter((row) => row.id !== action.payload)
        },
        setCustomRowLabel: (state, action) => {
          const { id, label } = action.payload
          const row = state.customRows.find((candidate) => candidate.id === id)
          if (row) row.label = label
        },
        setCustomRowValue: (state, action) => {
          const { id, columnKey, value } = action.payload
          const row = state.customRows.find((candidate) => candidate.id === id)
          if (row) row.values[columnKey] = value
        },
        reset: () => ({ overrides: {}, customRows: [] }),
        /** Replaces the whole slice with server state - see fromApiRows(). */
        hydrate: (state, action) => action.payload,
      },
    })

    // Bind so these can be passed directly as useSelector selectors.
    this.selectOverrides = (state) => state[this.name].overrides
    this.selectCustomRows = (state) => state[this.name].customRows
  }

  get reducer() {
    return this._slice.reducer
  }

  get actions() {
    return this._slice.actions
  }

  /** Standalone store containing only this table's slice. */
  createStore() {
    return configureStore({ reducer: { [this.name]: this.reducer } })
  }

  /** override-aware lookup: manual edit wins over the computed value. */
  effectiveValue(state, rowKey, columnKey, computedValue) {
    const key = `${rowKey}:${columnKey}`
    const overrides = this.selectOverrides(state)
    return key in overrides ? overrides[key] : computedValue
  }

  /**
   * Same total EditableTable shows in its Total row (fixed rows with any
   * overrides applied + custom rows), but callable from anywhere that reads
   * this slice's state - e.g. a sibling "results" table that needs to react
   * live to edits made in the actual editable table instead of only
   * reflecting the value at the moment it was computed.
   */
  effectiveTotal({ overrides, customRows }, rows, getValue, columnKey) {
    const fixedTotal = rows.reduce((sum, row) => {
      const key = `${row.key}:${columnKey}`
      const base = getValue(row.key, columnKey)
      return sum + (key in overrides ? overrides[key] : base)
    }, 0)
    const customTotal = customRows.reduce((sum, row) => sum + (row.values[columnKey] || 0), 0)
    return fixedTotal + customTotal
  }

  /**
   * Flattens this slice's {overrides, customRows} into the row[] shape the
   * table-row-values API expects: one entry per (rowKey, year) cell.
   * columnKey is always a year across every EditableTable consumer today.
   */
  toApiRows({ overrides, customRows }) {
    const rows = []
    for (const [key, value] of Object.entries(overrides)) {
      const separatorIndex = key.lastIndexOf(':')
      const rowKey = key.slice(0, separatorIndex)
      const year = Number(key.slice(separatorIndex + 1))
      rows.push({ rowKey, label: null, isCustom: false, year, value })
    }
    for (const row of customRows) {
      for (const [year, value] of Object.entries(row.values)) {
        rows.push({ rowKey: row.id, label: row.label, isCustom: true, year: Number(year), value })
      }
    }
    return rows
  }

  /** Inverse of toApiRows() - rebuilds {overrides, customRows} from the API's flat row[] shape. */
  fromApiRows(rows) {
    const overrides = {}
    const customRowsById = new Map()
    for (const row of rows) {
      if (row.isCustom) {
        if (!customRowsById.has(row.rowKey)) {
          customRowsById.set(row.rowKey, { id: row.rowKey, label: row.label ?? 'New row', values: {} })
        }
        customRowsById.get(row.rowKey).values[row.year] = row.value
      } else {
        overrides[`${row.rowKey}:${row.year}`] = row.value
      }
    }
    return { overrides, customRows: Array.from(customRowsById.values()) }
  }
}
