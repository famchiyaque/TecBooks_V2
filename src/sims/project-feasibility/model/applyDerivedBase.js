import { Logger } from '../utils/logger.js'
import { HORIZON_YEARS } from '../constants.js'

const logger = new Logger('ApplyDerivedBase')

function asNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function pct(value) {
  return asNumber(value)
}

const LINE_FIELDS = [
  'qualityYield',
  'secondsPerUnit',
  'hoursShift',
  'shifts',
  'productionLines',
  'weekWorkingDays',
  'monthsWorkingWeeks',
  'yearWorkingMonths',
]

/**
 * BUG FIX: game-to-cbm.mapper.js (DB round-trip - there's no per-year
 * capacity table yet, only one flat row per project) still hands this a
 * single number per field instead of a HORIZON_YEARS-indexed array. Left
 * as-is, CapacityLineTable/useIncome's array spread on it threw (crashed
 * the whole tab on any edit) and every year past index 0 read as undefined
 * (blank cells, flat/zeroed Customer Orders). Normalize once here - repeat
 * the captured scalar across every year, the same "flat until told
 * otherwise" convention the rest of the app already uses - so every
 * consumer of project.capacity.line can assume an array, always.
 */
function normalizeCapacityLine(line) {
  const normalized = {}
  LINE_FIELDS.forEach((field) => {
    const value = line?.[field]
    if (Array.isArray(value)) {
      normalized[field] = value
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      normalized[field] = HORIZON_YEARS.map(() => value)
    } else {
      normalized[field] = HORIZON_YEARS.map(() => undefined)
    }
  })
  return normalized
}

const ENGINEERING_EXACT_NAMES = ['GERENTE DE OPERACIONES']

/**
 * Mirrors src/adapters/excel/employee-table/Employee.js's category getter -
 * same Empleados_2 template, same classification rules. Keep both in sync.
 */
function classifyEmployeeCategory(name, type) {
  const upperName = String(name ?? '').toUpperCase()
  if (upperName.startsWith('MOD ')) return 'direct'
  if (upperName.startsWith('MOID ')) return 'indirect'
  if (upperName.startsWith('IM ') || upperName.includes('INGENIERO')) return 'engineering'
  if (ENGINEERING_EXACT_NAMES.includes(upperName)) return 'engineering'

  const normalizedType = String(type ?? '').trim().toLowerCase()
  if (normalizedType === 'administracion') return 'administrative'
  if (normalizedType === 'operacion') return 'indirect'
  return null
}

/**
 * annualCapacity = unitsPerHour x hoursShift x shifts x productionLines x
 * weekWorkingDays x monthsWorkingWeeks x yearWorkingMonths, unitsPerHour =
 * 3600/secondsPerUnit - Capacidad sheet's own "Anual Capacity" formula.
 * Exported so CapacityLineTable can show the same computed number the edits
 * feed into (annualCapacityByYear below), without duplicating the formula.
 */
export function capacityForIndex(line, index) {
  const seconds = line.secondsPerUnit?.[index]
  const unitsPerHour = typeof seconds === 'number' && seconds > 0 ? 3600 / seconds : undefined
  const factors = [
    unitsPerHour,
    line.hoursShift?.[index],
    line.shifts?.[index],
    line.productionLines?.[index],
    line.weekWorkingDays?.[index],
    line.monthsWorkingWeeks?.[index],
    line.yearWorkingMonths?.[index],
  ]
  return factors.every((n) => typeof n === 'number' && Number.isFinite(n))
    ? { unitsPerHour, capacity: factors.reduce((acc, n) => acc * n, 1) }
    : { unitsPerHour, capacity: undefined }
}

/**
 * Completes ProjectClass with values implied by inputs (not dashboard statements).
 */
export function applyDerivedBase(project) {
  // capacity.line fields are now per-year arrays (HORIZON_YEARS-indexed) -
  // see readCapacidad's BUG FIX. annualCapacity (scalar) keeps reading index
  // 0 only, for the one existing consumer (BreakEvenSummary's per-unit labor
  // cost) that expects a single year-zero number - annualCapacityByYear is
  // the new per-year series everything else should use going forward.
  project.capacity.line = normalizeCapacityLine(project.capacity.line)
  const line = project.capacity.line

  const { unitsPerHour, capacity: annualCapacity } = capacityForIndex(line, 0)
  const annualCapacityByYear = HORIZON_YEARS.map((_, index) => capacityForIndex(line, index).capacity)

  const machines = project.capacity.machines
  const operatorCount = machines.reduce((acc, machine) => acc + asNumber(machine.operators), 0)
  const supervisorCount = machines.length

  const bomMaterialCost = project.bom.parts.reduce(
    (acc, part) => acc + asNumber(part.quantity) * asNumber(part.cost),
    0
  )

  const monthShareSum = project.demand.monthShares.reduce((acc, n) => acc + asNumber(n), 0)
  const yearZeroOrdersSum = project.demand.yearZeroOrders.reduce((acc, n) => acc + asNumber(n), 0)

  const employees = project.employees.map((employee) => {
    // ISR is withheld from the employee, not added to employer cost - excluded here
    // to match the template's own "Salario Integrado" column.
    const benefitsTotal =
      asNumber(employee.percepcion) *
      (pct(employee.imss) +
        pct(employee.infonavit) +
        pct(employee.valesDespensa) +
        pct(employee.primaVacacional) +
        pct(employee.fondoAhorro) +
        pct(employee.comedor))
        + asNumber(employee.percepcion) / 30 * pct(employee.aguinaldo)
        
    const category = classifyEmployeeCategory(employee.name, employee.type)
    if (!category) {
      logger.warn('employee did not match any category - excluded from workforce totals', {
        name: employee.name,
        type: employee.type,
      })
    }
    return {
      name: employee.name,
      category,
      quantity: employee.cantidad,
      benefitsTotal,
      salarioIntegrado: asNumber(employee.percepcion) + benefitsTotal,
    }
  })

  logger.debug('employees classified from raw Empleados_2 sheet', {
    rawEmployeeCount: project.employees.length,
    employees: employees.map((e) => ({ name: e.name, category: e.category, quantity: e.quantity, salarioIntegrado: e.salarioIntegrado })),
  })

  project.derivedBase = {
    unitsPerHour,
    annualCapacity,
    annualCapacityByYear,
    operatorCount,
    supervisorCount,
    bomMaterialCost,
    monthShareSum,
    yearZeroOrdersSum,
    employees,
  }

  return project
}
