import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
  IconButton, TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutline from '@mui/icons-material/DeleteOutline'

function defaultFormat(value) {
  return `$${Math.round(value || 0).toLocaleString('es-MX')}`
}

function parseCellInput(raw) {
  const cleaned = String(raw).trim().replace(/,/g, '')
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : 0
}

/** Double-click a value to edit it inline; Enter/blur commits, Escape cancels. */
function EditableValueCell({ value, onCommit, align = 'right', formatValue }) {
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
      <TableCell align={align}>
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
          inputProps={{ style: { textAlign: align } }}
          sx={{ width: 130 }}
        />
      </TableCell>
    )
  }

  return (
    <TableCell align={align} onDoubleClick={startEditing} sx={{ cursor: 'text' }}>
      {formatValue(value)}
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
      <TableCell>
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
    <TableCell onDoubleClick={startEditing} sx={{ cursor: 'text' }}>
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
    <>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#073a5a', mt: 3 }}>
          {title}
        </Typography>
      )}
      <TableContainer component={Card} sx={{ mt: 1, borderRadius: '15px', border: 'solid #073a5a 1px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#073a5a' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Concepto</TableCell>
              {columns.map(({ key, label }) => (
                <TableCell key={key} align="right" sx={{ color: '#fff', fontWeight: 600 }}>
                  {label}
                </TableCell>
              ))}
              <TableCell sx={{ width: 120 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key} sx={{ '&:hover .row-actions': { opacity: 1 } }}>
                <TableCell>{row.label}</TableCell>
                {columns.map(({ key: columnKey }) => (
                  <EditableValueCell
                    key={columnKey}
                    value={effectiveValue(row.key, columnKey, getValue(row.key, columnKey))}
                    onCommit={(value) => dispatch(slice.actions.setOverride({ rowKey: row.key, columnKey, value }))}
                    formatValue={formatValue}
                  />
                ))}
                <TableCell align="right">
                  <IconButton
                    size="small"
                    className="row-actions"
                    aria-label="add row"
                    onClick={() => dispatch(slice.actions.addCustomRow())}
                    sx={{ opacity: 0, transition: 'opacity 0.15s' }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {customRows.map((customRow) => (
              <TableRow key={customRow.id} sx={{ '&:hover .row-actions': { opacity: 1 } }}>
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
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton
                    size="small"
                    className="row-actions"
                    aria-label="add row"
                    onClick={() => dispatch(slice.actions.addCustomRow())}
                    sx={{ opacity: 0, transition: 'opacity 0.15s' }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    className="row-actions"
                    aria-label="delete row"
                    onClick={() => dispatch(slice.actions.removeCustomRow(customRow.id))}
                    sx={{ opacity: 0, transition: 'opacity 0.15s' }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            <TableRow sx={{ backgroundColor: '#e4f1fe' }}>
              <TableCell sx={{ fontWeight: 700, color: '#073a5a' }}>{totalLabel}</TableCell>
              {columns.map(({ key: columnKey }, index) => (
                <TableCell key={columnKey} align="right" sx={{ fontWeight: 700, color: '#073a5a' }}>
                  {formatValue(totalsByColumn[index])}
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default EditableTable
