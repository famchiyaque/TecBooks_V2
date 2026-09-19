import { HORIZON_LENGTH, HORIZON_YEARS } from '../constants.js'

export function emptyYearSeries() {
  return Array.from({ length: HORIZON_LENGTH }, () => undefined)
}

export function normalizeLabel(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[.]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === ''
}

/** Empty → undefined. "-" is not coerced to 0 here. */
export function toNumberOrUndefined(value) {
  if (isBlank(value)) return undefined
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }
  const trimmed = String(value).trim().replace(/,/g, '')
  if (trimmed === '-') return undefined
  const num = Number(trimmed)
  return Number.isFinite(num) ? num : undefined
}

/** COs year-zero orders: "-" and empty → 0. */
export function toNumberDashAsZero(value) {
  if (isBlank(value)) return 0
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }
  const trimmed = String(value).trim().replace(/,/g, '')
  if (trimmed === '-') return 0
  const num = Number(trimmed)
  return Number.isFinite(num) ? num : 0
}

export function toStringOrUndefined(value) {
  if (isBlank(value)) return undefined
  return String(value).trim()
}

export function yearColumnMap(headerRow) {
  const map = {}
  if (!Array.isArray(headerRow)) return map
  headerRow.forEach((cell, index) => {
    const year = Number(cell)
    if (HORIZON_YEARS.includes(year)) {
      map[year] = index
    }
  })
  return map
}

export function seriesFromRow(row, colMap) {
  return HORIZON_YEARS.map((year) => {
    if (!(year in colMap)) return undefined
    return toNumberOrUndefined(row?.[colMap[year]])
  })
}

export function findRowByLabel(rows, expected) {
  const target = normalizeLabel(expected)
  return rows.find((row) => normalizeLabel(row?.[0]) === target) ?? null
}

export function labelIncludes(row, fragment) {
  return normalizeLabel(row?.[0]).includes(normalizeLabel(fragment))
}
