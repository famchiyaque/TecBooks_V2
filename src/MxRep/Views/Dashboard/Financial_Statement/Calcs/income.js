const months = ["January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October", "November", "December"
]

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, // No decimals
    maximumFractionDigits: 0, // No decimals
});

function money(integer) {
    return formatter.format(integer)
}

export function getIncomeStatement(simData, period, year) {
    const incomeStatement = []
    let currPeriod = period

    incomeStatement.push({
        month: months[currPeriod],
        sales: money(124094),
        cogs: 100000,
        gross: 24094,
        adminExp: 5000,
        sellingAndOperating: 1000,
        totalOperating: 0,
        ebitda: 18094,
        depreciation: -430,
        otherIncomeOrExpenses: 720,
        gainOrLossOnSaleOfFixedAssets: -200,
        incomePreTaxes: 18004,
        taxExpense: 300,
        netIncome: 17704
    })
    currPeriod--
    if (currPeriod < 0) currPeriod += 12

    incomeStatement.push({
        month: months[currPeriod],
        sales: 124094,
        cogs: 124094,
        gross: 24094,
        adminExp: 5000,
        sellingAndOperating: 1000,
        totalOperating: 0,
        ebitda: 18094,
        depreciation: -430,
        otherIncomeOrExpenses: 720,
        gainOrLossOnSaleOfFixedAsset: -200,
        incomePreTaxes: 18004,
        taxExpense: 300,
        netIncome: 17704
    })
    currPeriod--
    if (currPeriod < 0) currPeriod += 12

    incomeStatement.push({
        month: months[currPeriod],
        sales: 124094,
        cogs: 124094,
        gross: 24094,
        adminExp: 5000,
        sellingAndOperating: 1000,
        totalOperating: 0,
        ebitda: 18094,
        depreciation: -430,
        otherIncomeOrExpenses: 720,
        gainOrLossOnSaleOfFixedAsset: -200,
        incomePreTaxes: 18004,
        taxExpense: 300,
        netIncome: 17704
    })
    currPeriod--
    if (currPeriod < 0) currPeriod += 12

    incomeStatement.push({
        month: months[currPeriod],
        sales: 124094,
        cogs: 124094,
        gross: 24094,
        adminExp: 5000,
        sellingAndOperating: 1000,
        totalOperating: 0,
        ebitda: 18094,
        depreciation: -430,
        otherIncomeOrExpenses: 720,
        gainOrLossOnSaleOfFixedAsset: -200,
        incomePreTaxes: 18004,
        taxExpense: 300,
        netIncome: 17704
    })
    currPeriod--
    if (currPeriod < 0) currPeriod += 12

    incomeStatement.push({
        month: months[currPeriod],
        sales: 124094,
        cogs: 124094,
        gross: 24094,
        adminExp: 5000,
        sellingAndOperating: 1000,
        totalOperating: 0,
        ebitda: 18094,
        depreciation: -430,
        otherIncomeOrExpenses: 720,
        gainOrLossOnSaleOfFixedAsset: -200,
        incomePreTaxes: 18004,
        taxExpense: 300,
        netIncome: 17704
    })
    currPeriod--
    if (currPeriod < 0) currPeriod += 12

    console.log(incomeStatement)

    return incomeStatement
}