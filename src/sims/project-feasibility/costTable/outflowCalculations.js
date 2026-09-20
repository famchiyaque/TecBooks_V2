import { cbmToOperatingExpenseInputs } from './cbmToCostTableInputs'
import { assetsCapexInYear } from '@/utils/dashboard/assetSchedule.js'
import { Logger } from '../utils/logger.js'

const logger = new Logger('OutflowCalculations')

/**
 * RF-63 BUG FIX: Cash Outflows ("Salidas", Flujo sheet rows 13-30). Reuses
 * the same fields the Income Statement rows (buildCostOfSales) already
 * computed for everything except asset purchases - those are a one-time
 * cash event at each asset's own acquisition year (assetsCapexInYear), not
 * InputNovus' repeated flat book value counted as a fresh purchase every
 * single year the asset is still listed.
 */
export function computeCapexByYear(cbm, years) {
  const opex = cbmToOperatingExpenseInputs(cbm, years)

  const capexByYear = {}
  years.forEach((year) => {
    capexByYear[year] = {
      machinery: assetsCapexInYear(opex.machines, year, years),
      buildings: assetsCapexInYear(opex.assets.buildings, year, years),
      compute: assetsCapexInYear(opex.assets.compute, year, years),
      transport: assetsCapexInYear(opex.assets.transport, year, years),
    }
  })
  logger.debug('computeCapexByYear', { years, capexByYear })
  return capexByYear
}

export const OUTFLOW_ROWS = [
  { key: 'rawMaterial', label: 'Raw Materials' },
  { key: 'directLabour', label: 'Direct Labor' },
  { key: 'indirectManufacturing', label: 'Indirect Manufacturing Salaries' },
  { key: 'engineeringSalaries', label: 'Engineering Salaries' },
  { key: 'indirectMaterials', label: 'Indirect Materials' },
  { key: 'administrativeSalary', label: 'Administrative Salaries' },
  { key: 'administrativeGeneral', label: 'General Administrative Expenses' },
  { key: 'salesExpenses', label: 'Sales Expenses' },
  { key: 'machineryPurchase', label: 'Machinery Purchase' },
  { key: 'buildingPurchase', label: 'Building Construction/Purchase' },
  { key: 'civilWorks', label: 'Civil Works (Machinery Installation)' },
  { key: 'computerEquipment', label: 'Computer Equipment Purchase' },
  { key: 'transportEquipment', label: 'Transport Equipment Purchase' },
  { key: 'creditPayment', label: 'Credit Payment' },
  { key: 'creditInterest', label: 'Credit Interest' },
  { key: 'taxes', label: 'Taxes' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'otherExpenses', label: 'Other Expenses' },
]

/** rowByYear: costOfSalesByYear keyed by year. capexByYear: computeCapexByYear's output. */
export function outflowBaseValue(rowKey, year, rowByYear, capexByYear) {
  const row = rowByYear[year]
  const capex = capexByYear[year] ?? { machinery: 0, buildings: 0, compute: 0, transport: 0 }
  switch (rowKey) {
    case 'rawMaterial': return row?.rawMaterial ?? 0
    case 'directLabour': return row?.directLabour ?? 0
    case 'indirectManufacturing': return row?.indirectManufacturing ?? 0
    case 'engineeringSalaries': return row?.engineeringSalaries ?? 0
    case 'indirectMaterials': return row?.indirectMaterials ?? 0
    case 'administrativeSalary': return row?.administrativeSalary ?? 0
    case 'administrativeGeneral': return row?.administrativeExpenses
    case 'salesExpenses': return row?.salesExpenses ?? 0
    case 'machineryPurchase': return capex.machinery
    case 'buildingPurchase': return capex.buildings
    case 'civilWorks': return row?.civilWorks
    case 'computerEquipment': return capex.compute
    case 'transportEquipment': return capex.transport
    case 'creditPayment': return row?.creditPayment ?? 0
    case 'creditInterest': return row?.financialExpenses ?? 0
    case 'taxes': return (row?.isr ?? 0) + (row?.ptu ?? 0)
    case 'insurance': return 0
    case 'otherExpenses': return 0
    default: return 0
  }
}
