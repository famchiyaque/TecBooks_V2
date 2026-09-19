import { HORIZON_YEARS } from '../constants.js'
import { Logger } from '../utils/logger.js'

const logger = new Logger('ProjectPurchaseOrders')

function asFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

/**
 * Months after the last strictly positive month are treated as "not yet
 * happened" (readCOs stores "-" as 0). Zeros before that last positive
 * month stay in the YTD window as real zeros.
 */
export function lastObservedMonthIndex(yearZeroOrders) {
  for (let index = 11; index >= 0; index -= 1) {
    if (asFiniteNumber(yearZeroOrders?.[index]) > 0) return index
  }
  return -1
}

/**
 * Full-year equivalent of a stub year 0:
 * YTD units / sum of those months' demand shares.
 */
export function annualizeYearZero(yearZeroOrders, monthShares, yearZeroTotal) {
  const fallback = asFiniteNumber(yearZeroTotal)
  const lastObserved = lastObservedMonthIndex(yearZeroOrders)
  if (lastObserved < 0) return fallback

  let orderSum = 0
  let shareSum = 0
  for (let index = 0; index <= lastObserved; index += 1) {
    orderSum += asFiniteNumber(yearZeroOrders?.[index])
    shareSum += asFiniteNumber(monthShares?.[index])
  }
  if (shareSum <= 0) return fallback || orderSum
  return orderSum / shareSum
}

export function projectionBase(annualizedYearZero, history) {
  const totals = [asFiniteNumber(annualizedYearZero)]
  for (const row of history ?? []) {
    if (typeof row?.total === 'number' && Number.isFinite(row.total)) {
      totals.push(row.total)
    }
  }
  return totals.reduce((sum, value) => sum + value, 0) / totals.length
}

/**
 * Year 0 stays the workbook actual. Later years grow from the annualized
 * (and history-averaged) level: base × (1 + demandGrowth)^k.
 */
export function projectPurchaseOrders({
  yearZeroYear,
  yearZeroTotal,
  yearZeroOrders,
  monthShares,
  history,
  demandGrowth,
}) {
  const purchaseOrders = {}
  const actual = asFiniteNumber(yearZeroTotal)
  const annualized = annualizeYearZero(yearZeroOrders, monthShares, actual)
  const base = projectionBase(annualized, history)
  const growth = asFiniteNumber(demandGrowth)

  HORIZON_YEARS.forEach((year) => {
    if (yearZeroYear === undefined || year < yearZeroYear) return
    if (year === yearZeroYear) {
      purchaseOrders[year] = actual
      return
    }
    const yearsAhead = year - yearZeroYear
    purchaseOrders[year] = base * Math.pow(1 + growth, yearsAhead)
  })

  logger.debug('projectPurchaseOrders', {
    yearZeroYear,
    actual,
    annualized,
    historyCount: (history ?? []).length,
    base,
    demandGrowth: growth,
    purchaseOrders,
  })

  return purchaseOrders
}
