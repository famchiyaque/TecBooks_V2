import { configureStore, createSlice, nanoid } from '@reduxjs/toolkit'

/**
 * Reusable state for any "editable table": per-cell overrides on a fixed set
 * of rows, plus custom rows the user adds/removes. One instance per table
 * (e.g. `new EditableTableSlice('costTable')`, `new EditableTableSlice('balanceSheet')`)
 * - each gets its own independent Redux slice/store, no collisions between tables.
 *
 * Usage:
 *   export const myTableSlice = new EditableTableSlice('myTable')
 *   const store = myTableSlice.createStore()          // own store per table instance
 *   <Provider store={store}><EditableTable slice={myTableSlice} .../></Provider>
 *
 * Or reuse an existing store by merging `{ [slice.name]: slice.reducer }`
 * into its reducer map (see costTable.store.js).
 */
export class EditableTableSlice {
  constructor(name) {
    this.name = name

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
}
