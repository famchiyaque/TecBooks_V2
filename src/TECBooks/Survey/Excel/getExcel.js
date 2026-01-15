function numberDateToName(date) {
    const months = ['January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const newDate = date.split('-')
    const monthName = months[Number(newDate[1])]

    const result = monthName + ' ' + newDate[0]

    // console.log(result)
    return result
}

function getInstructionsSheet() {
    const data = [[], []]
    data.push(['', '', 'Welcome to your TECBooks custom excel file!'])
    data.push([])
    data.push(['', '', '1.', 'Follow the instructions that appear at the top of each sheet'])
    data.push([])
    data.push(['', '', '2.', 'Try to fill out as many cells as possible with data from your business'])
    data.push([])
    data.push(['', '', '3.', 'All numbers are positive, no need to make outflows negative'])
    data.push([])
    data.push(['', '', '4.', "Don't modify the placement of the cells, this will mess up the file's processing on upload"])
    data.push([])
    data.push(['', '', '5.', "Save the Overview sheet for last"])
    data.push([])
    data.push(['', '', '6.', "When you're all done, go back to the web app and upload it"])

    return data
}

function getOverviewSheet(bizInfo, startMonth, months) {
    const data = [[], ['', 'Overview', '', 'Name', bizInfo.name, '', 'Start', startMonth], []]

    data.push(['', '1.', 'You should be done filling out the other sheets first'])
    data.push(['', '2.', 'Copy the totals columns of the Revenue, Costs, Expenses, and OwnedAssets sheets into their respective columns'])
    data.push(['', '3.', "Calculate the 'Total' column by taking the Revenue and substracting everything else"])
    data.push([])

    data.push(['', 'Months', 'Revenue', 'Costs', 'Expenses', 'Depreciation', 'Total'])

    months.forEach((month) => {
        data.push(['', month]);
    });

    return data
};

function getRevenueSheet(revenue, months) {
    const productsList = revenue.filter(rev => rev.status === "Product");
    const servicesList = revenue.filter(rev => rev.status === "Service");

    const data = [[], ['', 'Revenue'], []];

    data.push(['', '1.', 'Enter the monthly revenue for each of the products and services listed'])
    data.push(['', '2.', "Sum each row in the 'Total' column"])
    data.push([])

    const titlesRow = ['', 'Months'];
    if (productsList.length > 0) {
        titlesRow.push('Products');
        for (let i = 0; i < productsList.length; i++) {
            titlesRow.push(productsList[i].name);
        };
    };
    if (servicesList.length > 0) {
        titlesRow.push('', 'Services');
        for (let i = 0; i < servicesList.length; i++) {
            titlesRow.push(servicesList[i].name);
        };
    };
    titlesRow.push('', 'Total');
    data.push(titlesRow);

    months.forEach((month) => {
        data.push(['', month]);
    });

    // console.log("Revenue Sheet", data);
    return data;
};

function getCostsSheet(employeesInfo, assetsInfo, months) {
    const data = [[], ['','Costs'], []];

    data.push(['', '1.', 'Enter the monthly salary for each employee  (you can change the employee # for their name), and amount spent on each fixed/variable cost'])
    data.push(['', '2.', "Sum each row in the 'Total' column"])
    data.push([])

    const empProduction = employeesInfo.empProduction;

    const titlesRow = ['', 'Months'];
    if (empProduction > 0) {
        titlesRow.push('Salaries');
        for (let i = 0; i < empProduction; i++) {
            titlesRow.push("Production Emp #" + (i+1));
        };
    };

    const rentedAssets = assetsInfo.assets.filter(asset => asset.status === 'Rented');
    if (rentedAssets.length > 0) {
        titlesRow.push('', 'Fixed Costs');
        for (let i = 0; i < rentedAssets.length; i++) {
            titlesRow.push(rentedAssets[i].name);
        };
    };

    if (assetsInfo.hasInventory) {
        titlesRow.push('', 'Variable Costs');
        if (assetsInfo.hasRW) titlesRow.push('Raw Materials');
        if (assetsInfo.hasWIPG) titlesRow.push('Work in Progress Goods')
        if (assetsInfo.hasFG) titlesRow.push('Finished Goods')
    };
    // titlesRow.push('Leftover', 'Total');
    titlesRow.push('', 'Total');
    data.push(titlesRow);

    months.forEach((month) => {
        data.push(['', month]);
    });

    // console.log("Costs Sheet", data);
    return data;
};

function getOwnedAssetsSheet(assetsInfo, months) {
    const data = [[], ['', 'Expenses of Owned Assets'], []]

    data.push(['', '1.', 'For each owned asset, enter the initial value'])
    data.push(['', '2.', "Enter the useful lifetime (in years) for each asset, unless for tangible assets you may use a % rate instead (only one necessary)"])
    data.push(['', '3.', 'To calculate the monthly depreciation with useful lifetime: Intial Value / (lifetime * 12)'])
    data.push(['', '', 'To calculate the monthly depreciation with % rate: Initial Value * %rate / 12'])
    data.push([])

    const ownedAssets = assetsInfo.assets.filter(asset => asset.status === 'Owned')

    const titlesRow = ['', 'Name', 'Type', 'Month Acquired', 'Initial Value', 'Lifetime (yrs)', 'Dep. Rate', 'Monthly Dep.']
    data.push(titlesRow)

    if (ownedAssets.length > 0) {
        for (let i = 0; i < ownedAssets.length; i++) {
            const newRow = ['', ownedAssets[i].name, ownedAssets[i].type, ownedAssets[i].dateAcq]
            data.push(newRow)
        }
    } else {
        data.push(['', 'No depreciable/amortizable assets, you can disregard this page'])
    }

    // console.log("Owned Assets Sheet, ", data)
    return data
};

function getExpensesSheet(employeesInfo, expenses, months) {
    const data = [[], ['', 'Expenses'], []];
    data.push(['', '1.', 'Enter the monthly salary for each employee (you can change the employee # for their name), and amount spent on each listed expense'])
    data.push(['', '2.', "Sum each row in the 'Total' column"])
    data.push([])

    const empAdmin = employeesInfo.empAdmin

    const titlesRow = ['', 'Months'];
    if (empAdmin > 0) {
        titlesRow.push('Salaries');
        for (let i = 0; i < empAdmin; i++) {
            titlesRow.push("Admin Emp #" + (i+1));
        };
    };

    const expensesArr = expenses.expenses
    // console.log(expensesArr)
    if (expensesArr.length > 0) {
        titlesRow.push('', 'Expenses');
        for (let i = 0; i < expensesArr.length; i++) {
            titlesRow.push(expensesArr[i].name);
        }
    };
    titlesRow.push('', 'Total');
    data.push(titlesRow);

    months.forEach((month) => {
        data.push(['', month]);
    });

    // console.log("Expenses Sheet", data);
    return data;
};

function getAccountsSheet(accountInfo, months) {
    const data = [[], ['', 'Liabilities and Receivables'], []]

    data.push(['', '1.', 'For each account payable/receivable, add the initial amount in its corresponding starting month'])
    data.push(['', '2.', 'For each month, enter the amount reduced from the account (amount of loan payed off, customer paying back part of debt)'])
    data.push(['', '3.', 'The intial amount for either kind of account is positive, the rest should entered as negative numbers'])
    data.push([])

    if (!accountInfo.hasAccsPayable && !accountInfo.hasAccsReceivable) {
        data.push(['', 'No accounts to track, you can disregard this page']);
        return data;
    }

    const titlesRow = ['', 'Months']
    if (accountInfo.accsPayable.length > 0) {
        titlesRow.push('Payables')
        for (let i = 0; i < accountInfo.accsPayable.length; i++) {
            titlesRow.push(accountInfo.accsPayable[i].name)
        }
    }
    if (accountInfo.accsReceivable.length > 0) {
        titlesRow.push('', 'Receivables')
        for (let i = 0; i < accountInfo.accsReceivable.length; i++) {
            titlesRow.push(accountInfo.accsReceivable[i].name)
        }
    }
    data.push(titlesRow)

    const allAccsP = accountInfo.accsPayable
    const allAccsR = accountInfo.accsReceivable
    console.log(allAccsP)

    months.forEach((month) => {
        const newRow = ['', month];
        const monthNum = new Date(month).getMonth() + 1;
        allAccsP.forEach((acc, idx) => {
            const nameDate = numberDateToName(acc.date)
            console.log("date of acc: ", nameDate)
            console.log("current month: ", month)
            if (nameDate === month) {
                newRow.push('')
                for (let i = 0; i < idx; i++) {
                    newRow.push('');
                }
                newRow.push('account started here');
            }
        });
        allAccsR.forEach((acc, idx) => {
            const nameDate = numberDateToName(acc.date)
            console.log("date of acc: ", nameDate)
            console.log("current month: ", month)
            if (nameDate === month) {
                newRow.push('', '', '', '')
                for (let i = 0; i < idx; i++) {
                    newRow.push('');
                }
                newRow.push('account started here');
            }
        });
        data.push(newRow);
    });

    // console.log("Accounts Sheet: ", data)
    return data
};

export const getExcelData = (surveyInfo) => {
    const bizInfo = surveyInfo.bizInfo;
    const revenue = surveyInfo.revenueInfo.revenue;
    const employeesInfo = surveyInfo.employeesInfo;
    const assetsInfo = surveyInfo.assetsInfo;
    const expenses = surveyInfo.expensesInfo;
    const accountsInfo = surveyInfo.accountsInfo;
    // console.log(bizInfo)
    // console.log(revenue)
    // console.log(employeesInfo)
    // console.log(assetsInfo)
    // console.log(expenses)
    console.log(accountsInfo)

    const startMonth = bizInfo.startMonth;
    // console.log(startMonth)

    const getMonthNames = (startMonth) => {
        const [year, month] = startMonth.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1); // Use local time
        const currentDate = new Date();
    
        const months = [];
        let tempDate = new Date(startDate); // Clone to avoid mutation
    
        while (tempDate <= currentDate) {
            months.push(tempDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
            tempDate.setMonth(tempDate.getMonth() + 1);
        }
    
        return months.reverse();
    };
    
    

    const months = getMonthNames(startMonth);
    // console.log(months)

    const instructionsData = getInstructionsSheet()
    const overviewData = getOverviewSheet(bizInfo, startMonth, months)
    const revenueData = getRevenueSheet(revenue, months);
    const costsData = getCostsSheet(employeesInfo, assetsInfo, months);
    const ownedAssetsData = getOwnedAssetsSheet(assetsInfo, months);
    const expensesData = getExpensesSheet(employeesInfo, expenses, months);
    const accountsData = getAccountsSheet(accountsInfo, months)
    // console.log(accountsData)

    const data = [instructionsData, overviewData, revenueData, costsData, expensesData, ownedAssetsData, accountsData];

    return data;
};

