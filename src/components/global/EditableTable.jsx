import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutline from '@mui/icons-material/DeleteOutline'

// Same Tailwind look as components/global/TableContainer.jsx (the shared
// card+table shell for financial data) - kept as its own component here
// because this one needs double-click-to-edit + hover add/delete, which
// TableContainer doesn't support.
const CELL_PAD = 'px-5 py-3'

function defaultFormat(value) {
  return `$${Math.round(value || 0).toLocaleString('es-MX')}`
}

function parseCellInput(raw) {
  const cleaned = String(raw).trim().replace(/,/g, '')
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : 0
}

function valueColorClass(value) {
  const isEmpty = value === undefined || value === null || value === ''
  if (isEmpty) return 'text-slate-300'
  return value < 0 ? 'text-rose-600' : 'text-emerald-700'
}

/** Double-click a value to edit it inline; Enter/blur commits, Escape cancels. */
function EditableValueCell({ value, onCommit, formatValue }) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState('')

  const startEditing = () => {
    setDraft(String(value ?? ''))
    setEditing(true)
  }

  const commit = () => {
    onCommit(parseCellInput(draft))
    setEditing(false)
  }

  if (editing) {
    return (
      <TableCell align="right" className={CELL_PAD}>
        <TextField
          autoFocus
          size="small"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit()
            if (event.key === 'Escape') setEditing(false)
          }}
          inputProps={{ style: { textAlign: 'right' } }}
          sx={{ width: 130 }}
        />
      </TableCell>
    )
  }

  return (
    <TableCell
      align="right"
      onDoubleClick={startEditing}
      className={`${CELL_PAD} whitespace-nowrap cursor-text`}
    >
      <span className={`tabular-nums ${valueColorClass(value)}`}>{formatValue(value)}</span>
    </TableCell>
  )
}

function EditableLabelCell({ label, onCommit }) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(label)

  const startEditing = () => {
    setDraft(label)
    setEditing(true)
  }

  const commit = () => {
    if (draft.trim()) onCommit(draft.trim())
    setEditing(false)
  }

  if (editing) {
    return (
      <TableCell className={CELL_PAD}>
        <TextField
          autoFocus
          size="small"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit()
            if (event.key === 'Escape') setEditing(false)
          }}
        />
      </TableCell>
    )
  }

  return (
    <TableCell
      onDoubleClick={startEditing}
      className={`${CELL_PAD} whitespace-nowrap cursor-text font-medium text-slate-700`}
    >
      {label}
    </TableCell>
  )
}

/**
 * Generic editable table: fixed rows (read from `getValue`, double-click to
 * override) + user-addable/removable custom rows, backed by an
 * EditableTableSlice instance. Drop this in for any new table instead of
 * rebuilding hover/add/delete/edit from scratch - just declare `rows`,
 * `columns` and how to read a value, same as CostOfSalesTable does.
 *
 * @param {string} title
 * @param {import('@/store/EditableTableSlice').EditableTableSlice} slice
 * @param {{key: string|number, label: string|number}[]} columns
 * @param {{key: string, label: string}[]} rows - fixed rows, not deletable
 * @param {(rowKey: string, columnKey: string|number) => number} getValue
 * @param {string} [totalLabel]
 * @param {(value: number) => string} [formatValue]
 */
function EditableTable({
  title, slice, columns, rows, getValue, totalLabel = 'Total', formatValue = defaultFormat,
}) {
  const dispatch = useDispatch()
  const overrides = useSelector(slice.selectOverrides)
  const customRows = useSelector(slice.selectCustomRows)

  const effectiveValue = (rowKey, columnKey, computedValue) => {
    const key = `${rowKey}:${columnKey}`
    return key in overrides ? overrides[key] : computedValue
  }

  const totalsByColumn = columns.map(({ key: columnKey }) => {
    const fixedTotal = rows.reduce(
      (sum, row) => sum + effectiveValue(row.key, columnKey, getValue(row.key, columnKey)),
      0
    )
    const customTotal = customRows.reduce((sum, row) => sum + (row.values[columnKey] || 0), 0)
    return fixedTotal + customTotal
  })

  return (
    <section className="mt-3 rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02]">
      {title && (
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table size="small" className="w-full min-w-max border-collapse text-sm">
          <TableHead>
            <TableRow className="border-b border-slate-200 bg-slate-50/60">
              <TableCell className={`${CELL_PAD} whitespace-nowrap text-[13px] font-medium text-slate-500`}>
                Concept
              </TableCell>
              {columns.map(({ key, label }) => (
                <TableCell
                  key={key}
                  align="right"
                  className={`${CELL_PAD} whitespace-nowrap text-[13px] font-medium text-slate-500`}
                >
                  {label}
                </TableCell>
              ))}
              <TableCell sx={{ width: 120 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={row.key}
                className={`group transition-colors hover:bg-slate-50/60 ${rowIndex % 2 === 1 ? 'bg-slate-50/30' : ''}`}
              >
                <TableCell className={`${CELL_PAD} whitespace-nowrap text-slate-700`}>{row.label}</TableCell>
                {columns.map(({ key: columnKey }) => (
                  <EditableValueCell
                    key={columnKey}
                    value={effectiveValue(row.key, columnKey, getValue(row.key, columnKey))}
                    onCommit={(value) => dispatch(slice.actions.setOverride({ rowKey: row.key, columnKey, value }))}
                    formatValue={formatValue}
                  />
                ))}
                <TableCell align="right" className={CELL_PAD}>
                  <IconButton
                    size="small"
                    aria-label="add row"
                    onClick={() => dispatch(slice.actions.addCustomRow())}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {customRows.map((customRow) => (
              <TableRow key={customRow.id} className="group transition-colors hover:bg-slate-50/60">
                <EditableLabelCell
                  label={customRow.label}
                  onCommit={(label) => dispatch(slice.actions.setCustomRowLabel({ id: customRow.id, label }))}
                />
                {columns.map(({ key: columnKey }) => (
                  <EditableValueCell
                    key={columnKey}
                    value={customRow.values[columnKey] || 0}
                    onCommit={(value) => dispatch(
                      slice.actions.setCustomRowValue({ id: customRow.id, columnKey, value })
                    )}
                    formatValue={formatValue}
                  />
                ))}
                <TableCell align="right" className={`${CELL_PAD} whitespace-nowrap`}>
                  <IconButton
                    size="small"
                    aria-label="add row"
                    onClick={() => dispatch(slice.actions.addCustomRow())}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="delete row"
                    onClick={() => dispatch(slice.actions.removeCustomRow(customRow.id))}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            <TableRow className="bg-slate-50/80">
              <TableCell className={`${CELL_PAD} whitespace-nowrap border-t border-slate-300 font-semibold text-slate-900`}>
                {totalLabel}
              </TableCell>
              {columns.map(({ key: columnKey }, index) => (
                <TableCell
                  key={columnKey}
                  align="right"
                  className={`${CELL_PAD} whitespace-nowrap border-t border-slate-300 font-semibold text-slate-900`}
                >
                  {formatValue(totalsByColumn[index])}
                </TableCell>
              ))}
              <TableCell className="border-t border-slate-300" />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

export default EditableTable
