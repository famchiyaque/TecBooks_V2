import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, TextField } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import {
  costTableEditsSlice, operatingExpenseEditsSlice, financialResultEditsSlice, taxesEditsSlice,
} from '@/store/costTable.store'
import {
  computeGrossProfit, computeOperatingProfit, computeIncomeBeforeTaxes, computeNetIncome,
} from '@/utils/dashboard/costCalculations'
import { COST_ROWS } from './CostOfSalesTable'
import { OPERATING_EXPENSE_ROWS } from './OperatingExpensesTable'

// RF-57: no separate Taxes table - ISR/PTU are simple enough (2 rows) to
// live directly in this table's "Total Taxes" breakdown, editable in place.
export const TAXES_ROWS = [
  { key: 'isr', label: 'ISR' },
  { key: 'ptu', label: 'PTU' },
]

// breakdown: which line items to unfold under this row (its "operation").
// formula: plain-text operation shown for rows whose operands are other
// rows already visible in this same table (no hidden line items to unfold).
const ROWS = [
  { key: 'netSales', label: 'Net Sales' },
  { key: 'totalCostOfSales', label: 'Total Cost of Sales', breakdown: 'costOfSales' },
  { key: 'grossProfit', label: 'Gross Profit', emphasize: true, formula: 'Net Sales − Total Cost of Sales' },
  { key: 'operatingExpenses', label: 'Total Operating Expenses', breakdown: 'operatingExpenses' },
  {
    key: 'operatingProfit', label: 'Operating Profit', emphasize: true,
    formula: 'Gross Profit − Total Operating Expenses',
  },
  { key: 'financialExpenses', label: 'Financial Expenses' },
  { key: 'creditPayment', label: 'Credit Payment' },
  { key: 'financialIncome', label: 'Financial Income' },
  {
    key: 'incomeBeforeTaxes', label: 'Income Before Taxes', emphasize: true,
    formula: 'Operating Profit − Financial Expenses − Credit Payment + Financial Income',
  },
  { key: 'taxesTotal', label: 'Total Taxes', breakdown: 'taxes', editableBreakdown: true },
  { key: 'netIncome', label: 'Net Income', emphasize: true, formula: 'Income Before Taxes − Total Taxes' },
]

// Full figure, rounded only to cents - matches EditableTable's formatter.
function formatCurrency(value) {
  const num = value || 0
  return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function valueColorClass(value) {
  if (value === undefined || value === null) return 'text-slate-300'
  return value < 0 ? 'text-rose-600' : 'text-emerald-700'
}

function parseCellInput(raw) {
  const cleaned = String(raw).trim().replace(/,/g, '')
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : 0
}

/** Double-click a breakdown line's value to edit it - same mechanic as EditableTable's cells. */
function EditableBreakdownValue({ value, onCommit }) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState('')

  if (editing) {
    return (
      <TextField
        autoFocus
        size="small"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => { onCommit(parseCellInput(draft)); setEditing(false) }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') { onCommit(parseCellInput(draft)); setEditing(false) }
          if (event.key === 'Escape') setEditing(false)
        }}
        inputProps={{ style: { textAlign: 'right' } }}
        sx={{ width: 110 }}
      />
    )
  }

  return (
    <span
      onDoubleClick={() => { setDraft(String(value ?? '')); setEditing(true) }}
      className={`tabular-nums cursor-text ${valueColorClass(value)}`}
    >
      {formatCurrency(value)}
    </span>
  )
}

function EditableBreakdownLabel({ label, onCommit }) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(label)

  if (editing) {
    return (
      <TextField
        autoFocus
        size="small"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => { if (draft.trim()) onCommit(draft.trim()); setEditing(false) }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') { if (draft.trim()) onCommit(draft.trim()); setEditing(false) }
          if (event.key === 'Escape') setEditing(false)
        }}
      />
    )
  }

  return (
    <span onDoubleClick={() => { setDraft(label); setEditing(true) }} className="cursor-text">
      {label}
    </span>
  )
}

/**
 * Read-only profit summary (Net Sales through Net Income). Not built on
 * EditableTable (would desync from the Cost Table / Operating Expenses
 * table these totals are derived from), but IS connected to every edits
 * slice: every computed row stays live against overrides made in any source
 * table (RF-54-07 / RF-55), not frozen at the value it had when this table
 * first rendered. Requires being mounted under the same <Provider
 * store={...}> as those tables (see ProjectDashboard.jsx). Sky accent (vs
 * the source tables' neutral slate) so this one reads as the "result", not
 * a cost breakdown.
 *
 * Each computed row can be expanded (chevron) to show the operation behind
 * it: totals unfold into their source line items, profit rows unfold into
 * the plain-text formula since their operands are already visible as other
 * rows in this same table. RF-56: Financial Expenses/Credit Payment/
 * Financial Income are atomic (no breakdown of their own, same as Net
 * Sales) but stay live against financialResultEditsSlice.
 * RF-57: Taxes (ISR/PTU) has no separate table - its breakdown is
 * editable in place (double-click, add/delete row) instead of just
 * displaying values, since 2 rows don't justify a whole extra card.
 */
function ProfitSummaryTable({ costOfSalesByYear }) {
  const dispatch = useDispatch()
  const [expandedRows, setExpandedRows] = React.useState(() => new Set())

  const overrides = useSelector(costTableEditsSlice.selectOverrides)
  const customRows = useSelector(costTableEditsSlice.selectCustomRows)
  const opexOverrides = useSelector(operatingExpenseEditsSlice.selectOverrides)
  const opexCustomRows = useSelector(operatingExpenseEditsSlice.selectCustomRows)
  const finOverrides = useSelector(financialResultEditsSlice.selectOverrides)
  const taxOverrides = useSelector(taxesEditsSlice.selectOverrides)
  const taxCustomRows = useSelector(taxesEditsSlice.selectCustomRows)

  const getValue = (rowKey, year) => costOfSalesByYear.find((row) => row.year === year)?.[rowKey] ?? 0

  const finLineValue = (rowKey, year) => {
    const overrideKey = `${rowKey}:${year}`
    return overrideKey in finOverrides ? finOverrides[overrideKey] : getValue(rowKey, year)
  }

  const rows = costOfSalesByYear.map((row) => {
    const totalCostOfSales = costTableEditsSlice.effectiveTotal(
      { overrides, customRows }, COST_ROWS, getValue, row.year
    )
    const grossProfit = computeGrossProfit(row.netSales, totalCostOfSales)
    const operatingExpenses = operatingExpenseEditsSlice.effectiveTotal(
      { overrides: opexOverrides, customRows: opexCustomRows }, OPERATING_EXPENSE_ROWS, getValue, row.year
    )
    const operatingProfit = computeOperatingProfit(grossProfit, operatingExpenses)
    const financialExpenses = finLineValue('financialExpenses', row.year)
    const creditPayment = finLineValue('creditPayment', row.year)
    const financialIncome = finLineValue('financialIncome', row.year)
    const incomeBeforeTaxes = computeIncomeBeforeTaxes(operatingProfit, financialExpenses, creditPayment, financialIncome)
    const taxesTotal = taxesEditsSlice.effectiveTotal(
      { overrides: taxOverrides, customRows: taxCustomRows }, TAXES_ROWS, getValue, row.year
    )
    return {
      year: row.year,
      netSales: row.netSales,
      totalCostOfSales,
      grossProfit,
      operatingExpenses,
      operatingProfit,
      financialExpenses,
      creditPayment,
      financialIncome,
      incomeBeforeTaxes,
      taxesTotal,
      netIncome: computeNetIncome(incomeBeforeTaxes, taxesTotal),
    }
  })

  const toggleRow = (key) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const breakdownConfig = {
    costOfSales: { fixedRows: COST_ROWS, rowOverrides: overrides, rowCustomRows: customRows },
    operatingExpenses: { fixedRows: OPERATING_EXPENSE_ROWS, rowOverrides: opexOverrides, rowCustomRows: opexCustomRows },
    taxes: { fixedRows: TAXES_ROWS, rowOverrides: taxOverrides, rowCustomRows: taxCustomRows, slice: taxesEditsSlice },
  }

  const breakdownLines = (type) => {
    const { fixedRows, rowOverrides, rowCustomRows } = breakdownConfig[type]

    const fixedLines = fixedRows.map((sourceRow) => ({
      id: sourceRow.key,
      label: sourceRow.label,
      custom: false,
      valueForYear: (year) => {
        const overrideKey = `${sourceRow.key}:${year}`
        return overrideKey in rowOverrides ? rowOverrides[overrideKey] : getValue(sourceRow.key, year)
      },
    }))
    const customLines = rowCustomRows.map((customRow) => ({
      id: customRow.id,
      label: customRow.label,
      custom: true,
      valueForYear: (year) => customRow.values[year] || 0,
    }))

    return [...fixedLines, ...customLines]
  }

  return (
    <section className="mt-3 rounded-2xl border-2 border-sky-200 bg-sky-50/30 shadow-sm">
      <div className="border-b border-sky-200 bg-sky-100/60 px-6 py-4">
        <h3 className="text-[15px] font-semibold text-sky-900">Profit Summary</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-sky-200 bg-sky-100/40">
              <th className="whitespace-nowrap px-2 py-2 text-left text-[11px] font-medium text-sky-700">Concept</th>
              {rows.map((row) => (
                <th key={row.year} className="whitespace-nowrap px-2 py-2 text-right text-[11px] font-medium text-sky-700">
                  {row.year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(({ key, label, emphasize, breakdown, formula, editableBreakdown }) => {
              const expandable = Boolean(breakdown || formula)
              const isExpanded = expandable && expandedRows.has(key)
              const slice = editableBreakdown ? breakdownConfig[breakdown].slice : null

              return (
                <React.Fragment key={key}>
                  <tr className={emphasize ? 'bg-sky-100/50' : ''}>
                    <td
                      className={
                        `whitespace-nowrap px-2 py-2 ${emphasize ? 'font-bold text-sky-900' : 'font-medium text-slate-700'}`
                      }
                    >
                      <span className="inline-flex items-center gap-1">
                        {expandable ? (
                          <IconButton
                            size="small"
                            aria-label={isExpanded ? 'collapse' : 'expand'}
                            onClick={() => toggleRow(key)}
                            className="!p-0.5"
                          >
                            <ExpandMoreIcon
                              fontSize="small"
                              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </IconButton>
                        ) : (
                          <span className="inline-block w-5" />
                        )}
                        {label}
                      </span>
                    </td>
                    {rows.map((row) => (
                      <td key={row.year} className="whitespace-nowrap px-2 py-2 text-right">
                        <span className={`tabular-nums ${emphasize ? 'font-bold' : ''} ${valueColorClass(row[key])}`}>
                          {formatCurrency(row[key])}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {isExpanded && breakdown && breakdownLines(breakdown).map((line) => (
                    <tr key={`${key}-${line.id}`} className="group bg-sky-50/50">
                      <td className="whitespace-nowrap py-1.5 pl-9 pr-2 text-slate-500">
                        {slice && line.custom ? (
                          <EditableBreakdownLabel
                            label={line.label}
                            onCommit={(value) => dispatch(slice.actions.setCustomRowLabel({ id: line.id, label: value }))}
                          />
                        ) : line.label}
                      </td>
                      {rows.map((row) => (
                        <td key={row.year} className="whitespace-nowrap py-1.5 pr-2 text-right">
                          {slice ? (
                            <EditableBreakdownValue
                              value={line.valueForYear(row.year)}
                              onCommit={(value) => dispatch(line.custom
                                ? slice.actions.setCustomRowValue({ id: line.id, columnKey: row.year, value })
                                : slice.actions.setOverride({ rowKey: line.id, columnKey: row.year, value }))}
                            />
                          ) : (
                            <span className={`tabular-nums ${valueColorClass(line.valueForYear(row.year))}`}>
                              {formatCurrency(line.valueForYear(row.year))}
                            </span>
                          )}
                        </td>
                      ))}
                      {slice && (
                        <td className="whitespace-nowrap py-1.5 pr-2 text-right">
                          {line.custom ? (
                            <IconButton
                              size="small"
                              aria-label="delete row"
                              onClick={() => dispatch(slice.actions.removeCustomRow(line.id))}
                              className="!p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton
                              size="small"
                              aria-label="add row"
                              onClick={() => dispatch(slice.actions.addCustomRow())}
                              className="!p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}

                  {isExpanded && formula && (
                    <tr className="bg-sky-50/50">
                      <td colSpan={rows.length + 1} className="whitespace-nowrap py-1.5 pl-9 pr-2 italic text-slate-500">
                        = {formula}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ProfitSummaryTable
