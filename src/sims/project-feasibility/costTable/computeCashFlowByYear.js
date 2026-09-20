import {startingMoneyFromCbm, baseEntradaValue} from "@/sims/project-feasibility/costTable/cashFlowCalculations.js"
import {OUTFLOW_ROWS, computeCapexByYear} from "@/sims/project-feasibility/costTable/outflowCalculations.js"
import {ENTRADA_ROWS} from "@/sims/project-feasibility/costTable/cashFlowCalculations.js"
import {outflowBaseValue} from "@/sims/project-feasibility/costTable/outflowCalculations.js"

export function computeCashFlowByYear(
  cbm,
  years,
  rowByYear,
) {
  const openingCash = startingMoneyFromCbm(cbm)
  const capexByYear = computeCapexByYear(cbm, years)

  const totalEntradas = {}
  const totalSalidas = {}
  const netFlow = {}
  const saldoInicial = {}

  years.forEach((year, index) => {
    // Saldo Inicial
    if (index === 0) {
      saldoInicial[year] = openingCash
    } else {
      const previousYear = years[index - 1]
      saldoInicial[year] = netFlow[previousYear]
    }

    // Entradas
    const entradaValue = (rowKey) => {
      if (rowKey === 'saldoInicial') {
        return saldoInicial[year]
      }

      return baseEntradaValue(
        rowKey,
        year,
        rowByYear
      )
    }

    totalEntradas[year] = ENTRADA_ROWS.reduce(
      (total, row) => total + (entradaValue(row.key) || 0),
      0
    )

    // Salidas
    const outflowValue = (rowKey) => {
      return outflowBaseValue(
        rowKey,
        year,
        rowByYear,
        capexByYear
      )
    }

    totalSalidas[year] = OUTFLOW_ROWS.reduce(
      (total, row) => total + (outflowValue(row.key) || 0),
      0
    )

    // Net Flow
    netFlow[year] =
      totalEntradas[year] -
      totalSalidas[year]
  })

  return {
    saldoInicial,
    totalEntradas,
    totalSalidas,
    netFlow,
  }
}