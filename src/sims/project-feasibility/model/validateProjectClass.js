import { HORIZON_LENGTH, HORIZON_YEARS, MONTHS } from '../constants.js'

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

function pushIfNegative(errors, label, value) {
  if (isFiniteNumber(value) && value < 0) {
    errors.push(`${label} cannot be negative`)
  }
}

// Mirrors computeFixedAssets.js's KNOWN_RATE_FIELD_BY_MATCH - a category
// matching one of these reads one of the 4 fixed depreciationX fields
// instead of a generic Premisas row. Matching the NAME is not enough though -
// see hasUsableSeries below, the field itself still has to carry real values
// (deleting the Premisas row leaves the field as an all-undefined default
// series, not a missing one, so presence alone doesn't prove a rate exists).
const KNOWN_DEPRECIATION_FIELD_BY_MATCH = [
  { match: 'equipo de transporte', field: 'depreciationTransport' },
  { match: 'transport equipment', field: 'depreciationTransport' },
  { match: 'edificios', field: 'depreciationBuildings' },
  { match: 'buildings', field: 'depreciationBuildings' },
  { match: 'equipo de computo', field: 'depreciationCompute' },
  { match: 'computer equipment', field: 'depreciationCompute' },
  { match: 'maquinaria', field: 'depreciationMachinery' },
  { match: 'machinery', field: 'depreciationMachinery' },
]

function normalizeLabel(text) {
  return String(text ?? '').toLowerCase().replace(/[.]/g, '').trim()
}

// BUG FIX: used to only check whether the category's NAME matched a known
// pattern (e.g. "Equipo de Transporte") and call that "has a rate" - true
// even after deleting the Premisas row for it, since the field still exists
// as a default series of `undefined`s. Must check the series actually has a
// real number somewhere, not just that the array exists.
function hasUsableSeries(series) {
  return Array.isArray(series) && series.some((value) => isFiniteNumber(value))
}

function knownDepreciationFieldForCategory(category) {
  const normalized = normalizeLabel(category)
  return KNOWN_DEPRECIATION_FIELD_BY_MATCH.find((item) => normalized.includes(item.match))?.field ?? null
}

function hasGenericDepreciationRate(depreciationByCategory, label) {
  const normalizedLabel = normalizeLabel(label)
  return Object.entries(depreciationByCategory ?? {}).some(([key, series]) => {
    const normalizedKey = normalizeLabel(key)
    const nameMatches = normalizedKey === normalizedLabel
      || normalizedLabel.includes(normalizedKey)
      || normalizedKey.includes(normalizedLabel)
    return nameMatches && hasUsableSeries(series)
  })
}

/**
 * RF-?? gate: an Inversion category that ends up depreciating at a silent
 * 0% (computeFixedAssets.js's rateSeriesForItem/rateSeriesForCategory
 * cascade finds nothing at any level - no item-level rate, no category-level
 * rate, no known fixed field) is a real Excel gap, not an acceptable
 * default - block the upload instead of letting Fixed Assets quietly never
 * depreciate that category.
 */
function checkInvestmentCategoriesHaveDepreciation(errors, project) {
  const byCategory = project.assets?.byCategory ?? {}
  const depreciationByCategory = project.premises?.depreciationByCategory ?? {}

  Object.entries(byCategory).forEach(([category, assets]) => {
    const knownField = knownDepreciationFieldForCategory(category)
    const categoryHasRate = (knownField && hasUsableSeries(project.premises?.[knownField]))
      || hasGenericDepreciationRate(depreciationByCategory, category)
    const anyItemHasOwnRate = (assets ?? []).some((asset) => hasGenericDepreciationRate(depreciationByCategory, asset.name))

    if (!categoryHasRate && !anyItemHasOwnRate) {
      errors.push(
        `Investment category "${category}" has no depreciation rate in Premisas - add a "Porcentaje Depreciacion ${category}" row (or one per item) before uploading`
      )
    }
  })
}

function checkYearSeries(errors, warnings, label, series, { rates = false } = {}) {
  if (!Array.isArray(series) || series.length !== HORIZON_LENGTH) {
    errors.push(`${label} must have ${HORIZON_LENGTH} years (2025-2035)`)
    return
  }
  series.forEach((value, index) => {
    if (value === undefined) return
    const year = HORIZON_YEARS[index] ?? `year ${index + 1}`
    if (!isFiniteNumber(value)) {
      errors.push(`${label} (${year}) is not a number`)
      return
    }
    if (value < 0) errors.push(`${label} (${year}) cannot be negative`)
    if (rates && value > 1) {
      warnings.push(`${label} (${year}) is ${value}; if it was meant to be a percentage, use a decimal (e.g. 0.18)`)
    }
  })
}

export function validateProjectClass(project) {
  const errors = []
  const warnings = []

  if (!project) {
    return { valid: false, errors: ['No project'], warnings }
  }

  if (!project.bom?.productName || !String(project.bom.productName).trim()) {
    errors.push('The product (BOM) must have a name')
  }

  if (!Array.isArray(project.capacity?.machines) || project.capacity.machines.length < 1) {
    errors.push('Capacity must have at least one machine')
  }

  if (!Array.isArray(project.bom?.parts) || project.bom.parts.length < 1) {
    errors.push('BOM must have at least one part')
  }

  if (!Array.isArray(project.demand?.monthShares) || project.demand.monthShares.length !== MONTHS.length) {
    errors.push('COs must have 12 monthly shares')
  }

  const shareSum = project.derivedBase?.monthShareSum
  if (isFiniteNumber(shareSum) && Math.abs(shareSum - 1) > 0.02) {
    warnings.push(`Sum of monthly % is ${shareSum}, expected 1`)
  }

  const premises = project.premises ?? {}
  const rateKeys = [
    'nationalLeadingRate',
    'cpp',
    'cetes',
    'libor',
    'nationalInflation',
    'isr',
    'impac',
    'ptu',
    'foreignInflation',
    'inventoryPct',
    'suppliersPct',
    'shortTermLiabilityPct',
    'directProductCostPct',
    'indirectProductCostPct',
    'salesExpensePct',
    'adminPct',
    'depreciationBuildings',
    'depreciationMachinery',
    'depreciationTransport',
    'depreciationCompute',
  ]
  checkYearSeries(errors, warnings, 'Exchange rate', premises.fxClose)
  rateKeys.forEach((key) => {
    checkYearSeries(errors, warnings, key, premises[key], { rates: true })
  })
  pushIfNegative(errors, 'Starting money', premises.startingMoney)

  project.demand?.monthShares?.forEach((value, i) => {
    if (value === undefined) return
    if (!isFiniteNumber(value)) errors.push(`% ${MONTHS[i]} is not a number`)
    else if (value < 0) errors.push(`% ${MONTHS[i]} cannot be negative`)
  })

  project.demand?.yearZeroOrders?.forEach((value, i) => {
    pushIfNegative(errors, `Year-zero orders ${MONTHS[i]}`, value)
  })

  const demandGrowth = premises.demandGrowth
  if (demandGrowth !== undefined) {
    if (!isFiniteNumber(demandGrowth)) errors.push('Demand growth is not a number')
    else if (demandGrowth < 0) warnings.push('Demand growth should not be negative')
    else if (demandGrowth > 1) {
      warnings.push(`Demand growth is ${demandGrowth}; if it was meant to be a percentage, use a decimal (e.g. 0.07)`)
    }
  }

  pushIfNegative(errors, 'Seconds x unit', project.capacity?.line?.secondsPerUnit)
  pushIfNegative(errors, 'Quality yield', project.capacity?.line?.qualityYield)

  project.capacity?.machines?.forEach((machine, i) => {
    if (!machine.code) errors.push(`Machine ${i + 1} missing code`)
    pushIfNegative(errors, `Operators ${machine.code ?? i}`, machine.operators)
    pushIfNegative(errors, `Cost ${machine.code ?? i}`, machine.acquisitionByYear?.[0])
    checkYearSeries(errors, warnings, `Acquisition ${machine.code ?? i}`, machine.acquisitionByYear)
  })

  pushIfNegative(errors, 'Sale price', project.bom?.salePrice)
  project.bom?.parts?.forEach((part, i) => {
    if (!part.id && !part.description) errors.push(`Part ${i + 1} is empty`)
    pushIfNegative(errors, `Quantity ${part.id ?? i}`, part.quantity)
    pushIfNegative(errors, `Cost ${part.id ?? i}`, part.cost)
  })

  for (const [group, list] of Object.entries(project.assets ?? {})) {
    if (!Array.isArray(list)) continue // byCategory is a {category: [...]} dict, not an array
    list.forEach((asset) => {
      checkYearSeries(errors, warnings, `${group} ${asset.name}`, asset.acquisitionByYear)
    })
  }
  checkInvestmentCategoriesHaveDepreciation(errors, project)

  project.employees?.forEach((employee) => {
    pushIfNegative(errors, `Gross pay ${employee.name}`, employee.percepcion)
    ;['imss', 'infonavit', 'valesDespensa', 'primaVacacional', 'aguinaldo', 'fondoAhorro', 'comedor', 'isr'].forEach(
      (key) => {
        const value = employee[key]
        if (value === undefined) return
        if (!isFiniteNumber(value)) errors.push(`${key} of ${employee.name} is not a number`)
        else if (value < 0) errors.push(`${key} of ${employee.name} cannot be negative`)
        else if (value > 1) {
          warnings.push(`${key} of ${employee.name} is ${value}; if it was meant to be a percentage, use a decimal`)
        }
      }
    )
  })

  project.services?.forEach((service) => {
    pushIfNegative(errors, `Service ${service.subcategory}`, service.monthlyAmount)
  })

  return { valid: errors.length === 0, errors, warnings }
}

export function validateProgram(program) {
  const errors = []
  if (!program?.name || !String(program.name).trim()) {
    errors.push('The program needs a name')
  }
  if (!Array.isArray(program?.projects) || program.projects.length < 1) {
    errors.push('The program needs at least one project')
  }
  if (program?.projects?.length > 10) {
    errors.push('Maximum 10 projects per program')
  }
  return { valid: errors.length === 0, errors, warnings: [] }
}
