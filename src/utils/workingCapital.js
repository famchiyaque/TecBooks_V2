/**
 * Calculates working capital from financial data
 * @param {Object} financialData - The financial data object
 * @param {Array} financialData.revenue - Revenue array (most recent first)
 * @param {Array} financialData.costs - Costs array (most recent first)
 * @param {Array} financialData.expenses - Expenses array (most recent first)
 * @returns {number} Working capital (current assets - current liabilities)
 * @throws {Error} If invalid data is provided
 */
export function calculateWorkingCapital(financialData) {
    // Validate input
    if (!financialData || typeof financialData !== 'object') {
        throw new Error('Invalid financial data provided');
    }

    // Helper function to safely get the latest value
    const getLatestValue = (array) => {
        if (!Array.isArray(array) || array.length === 0) return 0;
        const value = array[0]; // Most recent is first in array
        return typeof value === 'number' ? value : 0;
    };

    // Get current period values
    const currentAssets = getLatestValue(financialData.revenue);
    const currentCosts = getLatestValue(financialData.costs);
    const currentExpenses = getLatestValue(financialData.expenses);

    // Calculate working capital
    return currentAssets - (currentCosts + currentExpenses);
}

// Alternative default export if needed
export default calculateWorkingCapital;