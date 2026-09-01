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

export function readInversion(rows, project) {
  let currentKey = null
  let yearMap = {}

  for (const row of rows) {
    const label = normalizeLabel(row?.[0])
    const block = ASSET_BLOCKS.find((item) => label.startsWith(item.match))
    if (block) {
      currentKey = block.key
      yearMap = yearColumnMap(row)
      continue
    }
    if (!currentKey) continue
    const name = toStringOrUndefined(row?.[0])
    if (!name) {
      if (isBlank(row?.[1])) {
        currentKey = null
      }
      continue
    }
    if (ASSET_BLOCKS.some((item) => normalizeLabel(name).startsWith(item.match))) {
      continue
    }
    project.assets[currentKey].push({
      name,
      acquisitionByYear: seriesFromRow(row, yearMap),
    })
  }
}

export function readEmpleados2(rows, project) {
  for (const row of rows.slice(1)) {
    const name = toStringOrUndefined(row?.[0])
    if (!name) break
    project.employees.push({
      name,
      type: toStringOrUndefined(row[1]),
      percepcion: toNumberOrUndefined(row[2]),
      imss: toNumberOrUndefined(row[3]),
      infonavit: toNumberOrUndefined(row[4]),
      valesDespensa: toNumberOrUndefined(row[5]),
      primaVacacional: toNumberOrUndefined(row[6]),
      aguinaldo: toNumberOrUndefined(row[7]),
      fondoAhorro: toNumberOrUndefined(row[8]),
      comedor: toNumberOrUndefined(row[9]),
      isr: toNumberOrUndefined(row[10]),
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
