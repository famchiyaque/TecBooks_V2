import { HORIZON_LENGTH, HORIZON_YEARS, MONTHS } from '../constants.js'

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

function pushIfNegative(errors, label, value) {
  if (isFiniteNumber(value) && value < 0) {
    errors.push(`${label} cannot be negative`)
  }
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

  project.demand?.monthShares?.forEach((value, i) => {
    if (value === undefined) return
    if (!isFiniteNumber(value)) errors.push(`% ${MONTHS[i]} is not a number`)
    else if (value < 0) errors.push(`% ${MONTHS[i]} cannot be negative`)
  })

  project.demand?.yearZeroOrders?.forEach((value, i) => {
    pushIfNegative(errors, `Year-zero orders ${MONTHS[i]}`, value)
  })

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
    list.forEach((asset) => {
      checkYearSeries(errors, warnings, `${group} ${asset.name}`, asset.acquisitionByYear)
    })
  }

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
