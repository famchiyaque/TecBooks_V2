export const getIncomeStatement = (period, bizInfo, statementsData) => {
    // console.log("was in getIncomeStatement func")

    // let idx
    // for (let i = 0; i < bizInfo.months.length; i++) {
    //     if (period == bizInfo.months[i]) {
    //         idx = i
    //         break
    //     }
    // }

    // console.log('idx was: ', idx)

    // const od = overviewData

    // let result = {
    //     netSales: od.revenue[idx] ? (od.revenue[idx]).toFixed(0) : 0,
    //     cogs: od.costs[idx] ? (od.costs[idx]).toFixed(0) * -1 : 0,
    //     expenses: od.expenses[idx] ? (od.expenses[idx]).toFixed(0) * -1 : 0,
    //     dep: od.depreciation[idx] ? (overviewData.depreciation[idx]).toFixed(0) * -1 : 0
    // }

    let result = {
        netSales: statementsData.revenue,
        cogs: statementsData.costs,
        expenses: statementsData.expenses,
        dep: statementsData.dep,
    }

    const netIncome = result.netSales - result.cogs - result.expenses - result.dep

    result.netIncome = netIncome

    return result
}

export const getCashFlowsStatement = () => {

}


export const getStatements = () => {

}