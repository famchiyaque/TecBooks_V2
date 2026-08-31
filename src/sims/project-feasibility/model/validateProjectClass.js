import { HORIZON_LENGTH, MONTHS } from '../constants.js'

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

function pushIfNegative(errors, label, value) {
  if (isFiniteNumber(value) && value < 0) {
    errors.push(`${label} no puede ser negativo`)
  }
}

function checkYearSeries(errors, warnings, label, series, { rates = false } = {}) {
  if (!Array.isArray(series) || series.length !== HORIZON_LENGTH) {
    errors.push(`${label} debe tener ${HORIZON_LENGTH} años (2025–2035)`)
    return
  }
  series.forEach((value, index) => {
    if (value === undefined) return
    if (!isFiniteNumber(value)) {
      errors.push(`${label}[${index}] no es un número`)
      return
    }
    if (value < 0) errors.push(`${label}[${index}] no puede ser negativo`)
    if (rates && value > 1) {
      warnings.push(`${label}[${index}] es ${value}; si era un porcentaje, usa decimal (ej. 0.18)`)
    }
  })
}

export function validateProjectClass(project) {
  const errors = []
  const warnings = []

  if (!project) {
    return { valid: false, errors: ['No hay proyecto'], warnings }
  }

  if (!project.bom?.productName || !String(project.bom.productName).trim()) {
    errors.push('El producto (BOM) debe tener nombre')
  }

  if (!Array.isArray(project.capacity?.machines) || project.capacity.machines.length < 1) {
    errors.push('Capacidad debe tener al menos una máquina')
  }

  if (!Array.isArray(project.bom?.parts) || project.bom.parts.length < 1) {
    errors.push('BOM debe tener al menos una parte')
  }

  if (!Array.isArray(project.demand?.monthShares) || project.demand.monthShares.length !== MONTHS.length) {
    errors.push('COs debe tener 12 participaciones mensuales')
  }

  const shareSum = project.derivedBase?.monthShareSum
  if (isFiniteNumber(shareSum) && Math.abs(shareSum - 1) > 0.02) {
    warnings.push(`La suma de % mensuales es ${shareSum}, se esperaba 1`)
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
  checkYearSeries(errors, warnings, 'Tipo de cambio', premises.fxClose)
  rateKeys.forEach((key) => {
    checkYearSeries(errors, warnings, key, premises[key], { rates: true })
  })

  project.demand?.monthShares?.forEach((value, i) => {
    if (value === undefined) return
    if (!isFiniteNumber(value)) errors.push(`% ${MONTHS[i]} no es un número`)
    else if (value < 0) errors.push(`% ${MONTHS[i]} no puede ser negativo`)
  })

  project.demand?.yearZeroOrders?.forEach((value, i) => {
    pushIfNegative(errors, `Pedidos año cero ${MONTHS[i]}`, value)
  })

  pushIfNegative(errors, 'Seconds x unit', project.capacity?.line?.secondsPerUnit)
  pushIfNegative(errors, 'Quality yield', project.capacity?.line?.qualityYield)

  project.capacity?.machines?.forEach((machine, i) => {
    if (!machine.code) errors.push(`Máquina ${i + 1} sin código`)
    pushIfNegative(errors, `Operadores ${machine.code ?? i}`, machine.operators)
    pushIfNegative(errors, `Costo ${machine.code ?? i}`, machine.acquisitionByYear?.[0])
    checkYearSeries(errors, warnings, `Adquisición ${machine.code ?? i}`, machine.acquisitionByYear)
  })

  pushIfNegative(errors, 'Costo de venta', project.bom?.salePrice)
  project.bom?.parts?.forEach((part, i) => {
    if (!part.id && !part.description) errors.push(`Parte ${i + 1} vacía`)
    pushIfNegative(errors, `Cantidad ${part.id ?? i}`, part.quantity)
    pushIfNegative(errors, `Costo ${part.id ?? i}`, part.cost)
  })

  for (const [group, list] of Object.entries(project.assets ?? {})) {
    list.forEach((asset) => {
      checkYearSeries(errors, warnings, `${group} ${asset.name}`, asset.acquisitionByYear)
    })
  }

  project.employees?.forEach((employee) => {
    pushIfNegative(errors, `Percepción ${employee.name}`, employee.percepcion)
    ;['imss', 'infonavit', 'valesDespensa', 'primaVacacional', 'aguinaldo', 'fondoAhorro', 'comedor', 'isr'].forEach(
      (key) => {
        const value = employee[key]
        if (value === undefined) return
        if (!isFiniteNumber(value)) errors.push(`${key} de ${employee.name} no es un número`)
        else if (value < 0) errors.push(`${key} de ${employee.name} no puede ser negativo`)
        else if (value > 1) {
          warnings.push(`${key} de ${employee.name} es ${value}; si era un porcentaje, usa decimal`)
        }
      }
    )
  })

  project.services?.forEach((service) => {
    pushIfNegative(errors, `Servicio ${service.subcategory}`, service.monthlyAmount)
  })

  return { valid: errors.length === 0, errors, warnings }
}

export function validateProgram(program) {
  const errors = []
  if (!program?.name || !String(program.name).trim()) {
    errors.push('El programa necesita un nombre')
  }
  if (!Array.isArray(program?.projects) || program.projects.length < 1) {
    errors.push('El programa necesita al menos un proyecto')
  }
  if (program?.projects?.length > 10) {
    errors.push('Máximo 10 proyectos por programa')
  }
  return { valid: errors.length === 0, errors, warnings: [] }
}
