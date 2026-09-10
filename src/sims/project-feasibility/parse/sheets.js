import { MONTHS, SKIP_SERVICES_SUBCATEGORY } from '../constants.js'
import {
  isBlank,
  normalizeLabel,
  seriesFromRow,
  toNumberDashAsZero,
  toNumberOrUndefined,
  toStringOrUndefined,
  yearColumnMap,
} from './cells.js'

const PREMISES_ROWS = {
  'tipo de cambio al cierre (dolares)': 'fxClose',
  'tasa lider nacional': 'nationalLeadingRate',
  cpp: 'cpp',
  cetes: 'cetes',
  libor: 'libor',
  'inflacion nacional': 'nationalInflation',
  'tasa isr': 'isr',
  'tasa impac': 'impac',
  'tasa de ptu': 'ptu',
  'inflacion extranjera': 'foreignInflation',
  'porcentaje de inventario': 'inventoryPct',
  'porcentaje de proveedores': 'suppliersPct',
  'porcentaje de pasivo corto plazo': 'shortTermLiabilityPct',
  'porcentaje de costo directo del producto': 'directProductCostPct',
  'porcentaje de costo indirecto del producto': 'indirectProductCostPct',
  'porcentaje de gasto de venta': 'salesExpensePct',
  'porcentaje de administracion': 'adminPct',
  'porcentaje depreciacion edificios': 'depreciationBuildings',
  'porcentaje depreciacion maquinaria y equipo': 'depreciationMachinery',
  'porcentaje depreciacion equipo de transporte': 'depreciationTransport',
  'porcentaje depreciacion equipo de computo': 'depreciationCompute',
}

const LINE_LABELS = {
  'quality yield': 'qualityYield',
  'seconds x unit': 'secondsPerUnit',
  'hours shift': 'hoursShift',
  shifts: 'shifts',
  'production lines': 'productionLines',
  'week working days': 'weekWorkingDays',
  'months working weeks': 'monthsWorkingWeeks',
  'year working months': 'yearWorkingMonths',
}

const SKIP_LINE_LABELS = new Set(['units x hour', 'anual capacity', 'annual capacity'])

const ASSET_BLOCKS = [
  { match: 'equipo de transporte', key: 'transport' },
  { match: 'edificios', key: 'buildings' },
  { match: 'equipo de computo', key: 'compute' },
]

export function readPremisas(rows, project) {
  let lastYearMap = {}
  for (const row of rows) {
    const label = normalizeLabel(row?.[0])
    if (!label) {
      const maybeYears = yearColumnMap(row)
      if (Object.keys(maybeYears).length) lastYearMap = maybeYears
      continue
    }
    const asYears = yearColumnMap(row)
    if (Object.keys(asYears).length) {
      lastYearMap = asYears
    }
    if (label === 'periodos' || label.startsWith('periodos')) {
      project.timeline.financingPeriods = toNumberOrUndefined(row[1])
      continue
    }
    const field = PREMISES_ROWS[label]
    if (field) {
      project.premises[field] = seriesFromRow(row, lastYearMap)
    }
  }
}

export function readCOs(rows, project) {
  const history = []
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i]
    const month = toStringOrUndefined(row?.[0])
    if (normalizeLabel(month) === 'total') break
    const monthIndex = MONTHS.findIndex((name) => normalizeLabel(name) === normalizeLabel(month))
    if (monthIndex >= 0) {
      project.demand.monthShares[monthIndex] = toNumberOrUndefined(row[1])
      project.demand.yearZeroOrders[monthIndex] = toNumberDashAsZero(row[2])
    }
    const histYear = toNumberOrUndefined(row[4])
    const histTotal = toNumberOrUndefined(row[5])
    if (histYear !== undefined && histTotal !== undefined) {
      history.push({ year: histYear, total: histTotal })
    }
  }
  project.demand.history = history
  project.demand.yearZeroYear = toNumberOrUndefined(rows[1]?.[7])
  project.demand.yearZeroTotal = toNumberOrUndefined(rows[1]?.[8])
}

export function readCapacidad(rows, project) {
  const header = rows[0] ?? []
  const yearMap = yearColumnMap(header)

  for (const row of rows.slice(1)) {
    const label = normalizeLabel(row?.[0])
    if (label && !SKIP_LINE_LABELS.has(label) && LINE_LABELS[label]) {
      project.capacity.line[LINE_LABELS[label]] = toNumberOrUndefined(row[1])
    }

    const code = toStringOrUndefined(row?.[3])
    if (!code || normalizeLabel(code).startsWith('agregar')) continue
    project.capacity.machines.push({
      code,
      description: toStringOrUndefined(row[4]),
      processSeconds: toNumberOrUndefined(row[5]),
      operators: toNumberOrUndefined(row[6]),
      cycleTime: toNumberOrUndefined(row[7]),
      acquisitionByYear: seriesFromRow(row, yearMap),
    })
  }
}

export function readBOM(rows, project) {
  project.bom.productName = toStringOrUndefined(rows[0]?.[1]) ?? ''
  const header = rows[1] ?? []
  const salePriceCol = header.findIndex((cell) => normalizeLabel(cell) === 'costo de venta')
  if (salePriceCol >= 0) {
    project.bom.salePrice = toNumberOrUndefined(rows[1]?.[salePriceCol + 1])
  } else {
    project.bom.salePrice = toNumberOrUndefined(rows[1]?.[8])
  }

  for (const row of rows.slice(2)) {
    const id = toStringOrUndefined(row?.[0])
    const description = toStringOrUndefined(row?.[1])
    if (!id && !description) {
      if (project.bom.parts.length) break
      continue
    }
    project.bom.parts.push({
      id: id ?? '',
      description: description ?? '',
      quantity: toNumberOrUndefined(row[2]),
      cost: toNumberOrUndefined(row[3]),
    })
  }
}

/**
 * A row is a category header if ITS OWN cells are year values (2025, 2026...)
 * rather than money amounts - InputNovus isn't limited to the 3 categories
 * ASSET_BLOCKS knows by name (Edificios/Transporte/Computo), other projects'
 * Inversion sheets can have entirely different category names. Detecting the
 * header structurally (not by matching a fixed name list) means any category
 * name works. project.assets.byCategory captures ALL of them, generically;
 * project.assets.{transport,buildings,compute} keeps working exactly as
 * before (aliased in alongside, for the existing Cost Table/Income Statement/
 * Cash Flow pipeline that's hardcoded to those 3 names + machinery).
 */
export function readInversion(rows, project) {
  let currentKey = null
  let currentCategory = null
  let yearMap = {}

  for (const row of rows) {
    const rowYearMap = yearColumnMap(row)
    if (Object.keys(rowYearMap).length > 0) {
      currentCategory = toStringOrUndefined(row?.[0])
      yearMap = rowYearMap
      if (currentCategory) project.assets.byCategory[currentCategory] ??= []
      const label = normalizeLabel(row?.[0])
      const block = ASSET_BLOCKS.find((item) => label.startsWith(item.match))
      currentKey = block?.key ?? null
      continue
    }

    if (!currentCategory) continue
    const name = toStringOrUndefined(row?.[0])
    if (!name) {
      if (isBlank(row?.[1])) {
        currentKey = null
        currentCategory = null
      }
      continue
    }

    const asset = { name, acquisitionByYear: seriesFromRow(row, yearMap) }
    project.assets.byCategory[currentCategory].push(asset)
    if (currentKey) project.assets[currentKey].push(asset)
  }
}

const EMPLOYEE_HEADER = {
  nombre: 'name',
  tipo: 'type',
  percepcion: 'percepcion',
  imss: 'imss',
  infonavit: 'infonavit',
  'vales de despensa': 'valesDespensa',
  'prima vacacional': 'primaVacacional',
  aguinaldo: 'aguinaldo',
  'fondo de ahorro': 'fondoAhorro',
  comedor: 'comedor',
  isr: 'isr',
  cantidad: 'cantidad',
}

function employeeColumnIndex(headerRow, label) {
  return (headerRow ?? []).findIndex((cell) => normalizeLabel(cell) === label)
}

/**
 * Tabular Empleados sheet (same columns as the old Empleados_2, including Cantidad).
 */
export function readEmpleados(rows, project) {
  const header = rows[0] ?? []
  const columns = {}
  for (const [label, field] of Object.entries(EMPLOYEE_HEADER)) {
    const index = employeeColumnIndex(header, label)
    if (index >= 0) columns[field] = index
  }

  const nameCol = columns.name ?? 0
  const typeCol = columns.type ?? 1
  const percepcionCol = columns.percepcion ?? 2
  const cantidadCol = columns.cantidad

  for (const row of rows.slice(1)) {
    const name = toStringOrUndefined(row?.[nameCol])
    if (!name) break
    project.employees.push({
      name,
      type: toStringOrUndefined(row[typeCol]),
      percepcion: toNumberOrUndefined(row[percepcionCol]),
      imss: toNumberOrUndefined(row[columns.imss ?? 3]),
      infonavit: toNumberOrUndefined(row[columns.infonavit ?? 4]),
      valesDespensa: toNumberOrUndefined(row[columns.valesDespensa ?? 5]),
      primaVacacional: toNumberOrUndefined(row[columns.primaVacacional ?? 6]),
      aguinaldo: toNumberOrUndefined(row[columns.aguinaldo ?? 7]),
      fondoAhorro: toNumberOrUndefined(row[columns.fondoAhorro ?? 8]),
      comedor: toNumberOrUndefined(row[columns.comedor ?? 9]),
      isr: toNumberOrUndefined(row[columns.isr ?? 10]),
      cantidad: toNumberOrUndefined(row[cantidadCol]) ?? 1,
    })
  }
}

export function readServicios(rows, project) {
  let category
  for (const row of rows.slice(1)) {
    const subcategory = toStringOrUndefined(row?.[1])
    const description = toStringOrUndefined(row?.[2])
    if (!subcategory && !description) {
      if (project.services.length) break
      continue
    }
    const nextCategory = toStringOrUndefined(row?.[0])
    if (nextCategory) category = nextCategory
    if (SKIP_SERVICES_SUBCATEGORY.test(subcategory ?? '')) continue
    project.services.push({
      category: category ?? '',
      subcategory: subcategory ?? '',
      description: description ?? '',
      monthlyAmount: toNumberOrUndefined(row[3]),
    })
  }
}
