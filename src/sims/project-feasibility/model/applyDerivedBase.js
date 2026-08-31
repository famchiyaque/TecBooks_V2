function asNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function pct(value) {
  return asNumber(value)
}

/**
 * Completes ProjectClass with values implied by inputs (not dashboard statements).
 */
export function applyDerivedBase(project) {
  const seconds = project.capacity.line.secondsPerUnit
  const unitsPerHour =
    typeof seconds === 'number' && seconds > 0 ? 3600 / seconds : undefined

  const line = project.capacity.line
  const factors = [
    unitsPerHour,
    line.hoursShift,
    line.shifts,
    line.productionLines,
    line.weekWorkingDays,
    line.monthsWorkingWeeks,
    line.yearWorkingMonths,
  ]
  const annualCapacity = factors.every((n) => typeof n === 'number' && Number.isFinite(n))
    ? factors.reduce((acc, n) => acc * n, 1)
    : undefined

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
    const benefitsTotal =
      asNumber(employee.percepcion) *
      (pct(employee.imss) +
        pct(employee.infonavit) +
        pct(employee.valesDespensa) +
        pct(employee.primaVacacional) +
        pct(employee.aguinaldo) +
        pct(employee.fondoAhorro) +
        pct(employee.comedor) +
        pct(employee.isr))
    return {
      name: employee.name,
      benefitsTotal,
      salarioIntegrado: asNumber(employee.percepcion) + benefitsTotal,
    }
  })

  project.derivedBase = {
    unitsPerHour,
    annualCapacity,
    operatorCount,
    supervisorCount,
    bomMaterialCost,
    monthShareSum,
    yearZeroOrdersSum,
    employees,
  }

  return project
}
