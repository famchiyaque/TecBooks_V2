import React from 'react'
import { IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

function formatCurrency(value) {
  const num = Number(value) || 0
  return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function valueColorClass(value) {
  if (value === undefined || value === null) return 'text-slate-300'
  return value < 0 ? 'text-rose-600' : 'text-emerald-700'
}

/**
 * Fixed Assets (Balance Sheet): gross value, accumulated depreciation (shown
 * as a negative line, accounting-style) and net value per asset category -
 * dynamic, as many rows as the Excel actually has categories, not just
 * Buildings/Transport/Compute/Machinery. Read-only (everything is derived
 * from the Excel, no manual overrides here).
 *
 * "Accumulated Depreciation" and "Total Net Fixed Assets" can be expanded
 * (same pattern as ProfitSummaryTable): the first shows the individual
 * assets driving that category's number (name + cumulative value per year)
 * plus that year's Annual Depreciation and the formula; the second shows
 * only the formula, since its operands (Gross Value / Accumulated
 * Depreciation) are already visible rows above.
 */
function FixedAssetsTable({ byCategory, total }) {
  const [expandedRows, setExpandedRows] = React.useState(() => new Set())

  const categories = Object.keys(byCategory ?? {})
  const years = total?.map((row) => row.year) ?? []

  if (categories.length === 0) {
    return null
  }

  const rowValue = (categoryRows, year, key) => categoryRows.find((row) => row.year === year)?.[key] ?? 0
  const itemValue = (item, year) => item.cumulativeByYear?.[year] ?? 0

  const toggleRow = (rowId) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) next.delete(rowId)
      else next.add(rowId)
      return next
    })
  }

  return (
    <section className="mt-3 rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02]">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-[15px] font-semibold text-slate-900">Fixed Assets</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60">
              <th className="whitespace-nowrap px-2 py-2 text-left text-[11px] font-medium text-slate-500">Concept</th>
              {years.map((year) => (
                <th key={year} className="whitespace-nowrap px-2 py-2 text-right text-[11px] font-medium text-slate-500">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const { rows: categoryRows, items } = byCategory[category]
              const rowId = `${category}-depreciation`
              const isExpanded = expandedRows.has(rowId)

              return (
                <React.Fragment key={category}>
                  <tr className="bg-slate-50/30">
                    <td className="whitespace-nowrap px-2 py-2 font-medium text-slate-700">{category}</td>
                    {years.map((year) => (
                      <td key={year} className="whitespace-nowrap px-2 py-2 text-right tabular-nums text-emerald-700">
                        {formatCurrency(rowValue(categoryRows, year, 'grossValue'))}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="whitespace-nowrap px-2 py-2 text-slate-500">
                      <span className="inline-flex items-center gap-1 pl-4">
                        <IconButton
                          size="small"
                          aria-label={isExpanded ? 'collapse' : 'expand'}
                          onClick={() => toggleRow(rowId)}
                          className="!p-0.5"
                        >
                          <ExpandMoreIcon
                            fontSize="small"
                            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </IconButton>
                        (-) Accumulated Depreciation
                      </span>
                    </td>
                    {years.map((year) => (
                      <td key={year} className="whitespace-nowrap px-2 py-2 text-right tabular-nums text-rose-600">
                        ({formatCurrency(rowValue(categoryRows, year, 'accumulatedDepreciation'))})
                      </td>
                    ))}
                  </tr>

                  {isExpanded && (
                    <>
                      {items.map((item) => (
                        <tr key={item.name} className="bg-slate-50/50">
                          <td className="whitespace-nowrap py-1.5 pl-11 pr-2 text-slate-500">{item.name}</td>
                          {years.map((year) => (
                            <td key={year} className="whitespace-nowrap py-1.5 pr-2 text-right">
                              <span className="tabular-nums text-emerald-700">{formatCurrency(itemValue(item, year))}</span>
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-slate-50/50">
                        <td className="whitespace-nowrap py-1.5 pl-11 pr-2 text-slate-500">Annual Depreciation (this year)</td>
                        {years.map((year) => (
                          <td key={year} className="whitespace-nowrap py-1.5 pr-2 text-right">
                            <span className={`tabular-nums ${valueColorClass(-rowValue(categoryRows, year, 'annualDepreciation'))}`}>
                              ({formatCurrency(rowValue(categoryRows, year, 'annualDepreciation'))})
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td colSpan={years.length + 1} className="whitespace-nowrap py-1.5 pl-11 pr-2 italic text-slate-500">
                          Annual Depreciation = Cumulative Gross Value × Depreciation Rate
                          <br />
                          Accumulated Depreciation = Accumulated Depreciation (prior year) + Annual Depreciation
                        </td>
                      </tr>
                    </>
                  )}
                </React.Fragment>
              )
            })}

            <tr className="bg-slate-50/80">
              <td className="whitespace-nowrap px-2 py-2 border-t border-slate-300 font-semibold text-slate-900">
                <span className="inline-flex items-center gap-1">
                  <IconButton
                    size="small"
                    aria-label={expandedRows.has('total') ? 'collapse' : 'expand'}
                    onClick={() => toggleRow('total')}
                    className="!p-0.5"
                  >
                    <ExpandMoreIcon
                      fontSize="small"
                      className={`transition-transform ${expandedRows.has('total') ? 'rotate-180' : ''}`}
                    />
                  </IconButton>
                  Total Net Fixed Assets
                </span>
              </td>
              {years.map((year) => (
                <td key={year} className="whitespace-nowrap px-2 py-2 border-t border-slate-300 text-right tabular-nums font-semibold text-slate-900">
                  {formatCurrency(rowValue(total, year, 'netValue'))}
                </td>
              ))}
            </tr>

            {expandedRows.has('total') && (
              <tr className="bg-slate-50/50">
                <td colSpan={years.length + 1} className="whitespace-nowrap py-1.5 pl-9 pr-2 italic text-slate-500">
                  = Σ Gross Value (all categories) − Σ Accumulated Depreciation (all categories)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default FixedAssetsTable
