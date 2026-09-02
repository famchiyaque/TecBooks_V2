import React from 'react'
import { useSelector } from 'react-redux'
import { IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { costTableEditsSlice, operatingExpenseEditsSlice, financialResultEditsSlice } from '@/store/costTable.store'
import { computeGrossProfit, computeOperatingProfit, computeIncomeBeforeTaxes } from '@/utils/dashboard/costCalculations'
import { COST_ROWS } from './CostOfSalesTable'
import { OPERATING_EXPENSE_ROWS } from './OperatingExpensesTable'

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

/**
 * Read-only profit summary (Net Sales through Operating Profit). Not built
 * on EditableTable (still not double-click editable - editing these
 * directly would desync them from the Cost Table / Operating Expenses table
 * they're derived from), but IS connected to both edits slices: every
 * computed row stays live against overrides made in either source table
 * (RF-54-07 / RF-55), not frozen at the value it had when this table first
 * rendered. Requires being mounted under the same <Provider store={...}> as
 * those tables (see ProjectDashboard.jsx). Sky accent (vs the source
 * tables' neutral slate) so this one reads as the "result", not a cost
 * breakdown.
 *
 * Each computed row can be expanded (chevron) to show the operation behind
 * it: totals unfold into their source line items (same values as the Cost
 * Table / Operating Expenses table above, so no need to scroll up to check
 * what's included), profit rows unfold into the plain-text formula since
 * their operands are already visible as other rows in this same table.
 * RF-56: Financial Expenses/Credit Payment/Financial Income are atomic (no
 * breakdown of their own, same as Net Sales) but stay live against
 * financialResultEditsSlice, same override mechanism as everything else.
 */
function ProfitSummaryTable({ costOfSalesByYear }) {
  const [expandedRows, setExpandedRows] = React.useState(() => new Set())

  const overrides = useSelector(costTableEditsSlice.selectOverrides)
  const customRows = useSelector(costTableEditsSlice.selectCustomRows)
  const opexOverrides = useSelector(operatingExpenseEditsSlice.selectOverrides)
  const opexCustomRows = useSelector(operatingExpenseEditsSlice.selectCustomRows)
  const finOverrides = useSelector(financialResultEditsSlice.selectOverrides)

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
      incomeBeforeTaxes: computeIncomeBeforeTaxes(operatingProfit, financialExpenses, creditPayment, financialIncome),
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

  const breakdownLines = (type) => {
    const isOpex = type === 'operatingExpenses'
    const fixedRows = isOpex ? OPERATING_EXPENSE_ROWS : COST_ROWS
    const rowOverrides = isOpex ? opexOverrides : overrides
    const rowCustomRows = isOpex ? opexCustomRows : customRows

    const fixedLines = fixedRows.map((sourceRow) => ({
      id: sourceRow.key,
      label: sourceRow.label,
      valueForYear: (year) => {
        const overrideKey = `${sourceRow.key}:${year}`
        return overrideKey in rowOverrides ? rowOverrides[overrideKey] : getValue(sourceRow.key, year)
      },
    }))
    const customLines = rowCustomRows.map((customRow) => ({
      id: customRow.id,
      label: customRow.label,
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
            {ROWS.map(({ key, label, emphasize, breakdown, formula }) => {
              const expandable = Boolean(breakdown || formula)
              const isExpanded = expandable && expandedRows.has(key)

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
                    <tr key={`${key}-${line.id}`} className="bg-sky-50/50">
                      <td className="whitespace-nowrap py-1.5 pl-9 pr-2 text-slate-500">{line.label}</td>
                      {rows.map((row) => (
                        <td key={row.year} className="whitespace-nowrap py-1.5 pr-2 text-right">
                          <span className={`tabular-nums ${valueColorClass(line.valueForYear(row.year))}`}>
                            {formatCurrency(line.valueForYear(row.year))}
                          </span>
                        </td>
                      ))}
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
