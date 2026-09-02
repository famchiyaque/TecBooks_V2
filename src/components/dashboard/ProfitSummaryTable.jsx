import React from 'react'
import { useSelector } from 'react-redux'
import { costTableEditsSlice } from '@/store/costTable.store'
import { computeGrossProfit } from '@/utils/dashboard/costCalculations'
import { COST_ROWS } from './CostOfSalesTable'

const ROWS = [
  { key: 'netSales', label: 'Net Sales' },
  { key: 'totalCostOfSales', label: 'Total Cost of Sales' },
  { key: 'grossProfit', label: 'Gross Profit', emphasize: true },
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
 * Read-only profit summary (Net Sales, Total Cost of Sales, Gross Profit).
 * Not built on EditableTable (still not double-click editable - editing
 * these directly would desync them from the Cost Table they're derived
 * from), but IS connected to the same costTableEditsSlice the Cost Table
 * writes to: totalCostOfSales/grossProfit are recomputed live from any
 * override made there (RF-54-07), not frozen at the value they had when
 * this table first rendered. Requires being mounted under the same
 * <Provider store={...}> as the Cost Table (see ProjectDashboard.jsx).
 * Sky accent (vs the Cost Table's neutral slate) so the two don't blur
 * together at a glance - this one is the "result", not a cost breakdown.
 */
function ProfitSummaryTable({ costOfSalesByYear }) {
  const overrides = useSelector(costTableEditsSlice.selectOverrides)
  const customRows = useSelector(costTableEditsSlice.selectCustomRows)

  const getValue = (rowKey, year) => costOfSalesByYear.find((row) => row.year === year)?.[rowKey] ?? 0

  const rows = costOfSalesByYear.map((row) => {
    const totalCostOfSales = costTableEditsSlice.effectiveTotal(
      { overrides, customRows }, COST_ROWS, getValue, row.year
    )
    return {
      year: row.year,
      netSales: row.netSales,
      totalCostOfSales,
      grossProfit: computeGrossProfit(row.netSales, totalCostOfSales),
    }
  })

  return (
    <section className="mt-3 rounded-2xl border-2 border-sky-200 bg-sky-50/30 shadow-sm">
      <div className="border-b border-sky-200 bg-sky-100/60 px-6 py-4">
        <h3 className="text-[15px] font-semibold text-sky-900">Utilidades</h3>
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
            {ROWS.map(({ key, label, emphasize }) => (
              <tr key={key} className={emphasize ? 'bg-sky-100/50' : ''}>
                <td
                  className={
                    `whitespace-nowrap px-2 py-2 ${emphasize ? 'font-bold text-sky-900' : 'font-medium text-slate-700'}`
                  }
                >
                  {label}
                </td>
                {rows.map((row) => (
                  <td key={row.year} className="whitespace-nowrap px-2 py-2 text-right">
                    <span className={`tabular-nums ${emphasize ? 'font-bold' : ''} ${valueColorClass(row[key])}`}>
                      {formatCurrency(row[key])}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ProfitSummaryTable
