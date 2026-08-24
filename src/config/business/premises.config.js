/**
 * Financial Assumptions Based On Country
 *
 * This is the single source of truth for financial assumptions.
 * The business model will use the country from metadata to determine the financial assumptions.
 */

/**
 * Financial assumptions objects for different countries
 * @returns {Object}
 */
export const premises = {
  mexico: {
    interestRate: 0,
    inflationRate: 0,
    businessIncomeTax: 0,
    employeeShareOfProfit: 0, // PTU
    marketRate: 0,
    rewardMargin: 0,
    inventoryPercentage: 0,
    providerPercentage: 0,
    shortTermPassive: 0,
    directProductCosts: 0,
    indirectProductCosts: 0,
    salesExpenses: 0,
    administrationPercentage: 0,
    depreciationRates: {
      building: 0,
      machinery: 0,
      vehicle: 0,
      computerEquipment: 0,
      furniture: 0,
    },
    machineryInstallationRate: 0,
  },
  usa: {
    interestRate: 0,
    inflationRate: 0,
    businessIncomeTax: 0,
    employeeShareOfProfit: 0,
    marketRate: 0,
    rewardMargin: 0,
    inventoryPercentage: 0,
    providerPercentage: 0,
    shortTermPassive: 0,
    directProductCosts: 0,
    indirectProductCosts: 0,
    salesExpenses: 0,
    administrationPercentage: 0,
    depreciationRates: {
      building: 0,
      machinery: 0,
      vehicle: 0,
      computerEquipment: 0,
      furniture: 0,
    },
    machineryInstallationRate: 0,
  },
}
