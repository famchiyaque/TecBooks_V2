function parseDateInput(dateInput) {
    // If it's already a Date object, return it
    if (dateInput instanceof Date) return dateInput;
    
    // If it's an Excel serial number (number type)
    if (typeof dateInput === 'number') {
        return excelDateToJSDate(dateInput);
    }
    
    // If it's a string like "2025-01"
    if (typeof dateInput === 'string') {
        // Handle YYYY-MM format
        const parts = dateInput.split('-');
        if (parts.length === 2) {
            return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
        }
        // Handle other date string formats if needed
        return new Date(dateInput);
    }
    
    // Fallback for invalid dates
    return new Date(NaN);
}

function excelDateToJSDate(serial) {
    // Only needed if you actually get Excel serial numbers
    const utcDays = Math.floor(serial - 1);
    const msPerDay = 86400000;
    return new Date(Date.UTC(0, 0, utcDays));
}

function getBizInfo(overviewSheet) {
    let rawStartMonth = overviewSheet[0][7];
    console.log("Raw date value:", rawStartMonth, typeof rawStartMonth);

    // Parse the date (handles both Excel serial numbers and "YYYY-MM" strings)
    let startMonthDate;
    if (typeof rawStartMonth === 'number') {
        // Excel serial date number
        const utcDays = Math.floor(rawStartMonth - 1);
        const msPerDay = 86400000;
        startMonthDate = new Date(Date.UTC(0, 0, utcDays));
    } else if (typeof rawStartMonth === 'string' && rawStartMonth.match(/^\d{4}-\d{2}$/)) {
        // "YYYY-MM" format
        const [year, month] = rawStartMonth.split('-').map(Number);
        startMonthDate = new Date(year, month - 1, 1);
    } else {
        // Fallback - try to parse as Date
        startMonthDate = new Date(rawStartMonth);
    }

    console.log("Parsed date:", startMonthDate);

    const formattedDate = startMonthDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    console.log(formattedDate)
    
    // let startMonthDate = parseDateInput(rawStartMonth);
    // console.log("Parsed date:", startMonthDate);

    // console.log(overviewSheet)
    let bizInfo = {
        name: overviewSheet[0][4],
        // startMonth: overviewSheet[0][6]
        startMonth: formattedDate
        // startMonth: `${startMonthDate.getFullYear()}-${(startMonthDate.getMonth() + 1).toString().padStart(2, '0')}`
    }

    console.log(bizInfo.startMonth)

    const months = []
    for (let i = 7; i < overviewSheet.length; i++) {
        months.push(overviewSheet[i][1])
    }

    bizInfo.months = months

    return bizInfo
}

function getOverviewData(overviewSheet) {
    let revCol, costsCol, expensesCol, depCol, accountsCol, totalCol;
    const revenue = [], costs = [], expenses = [], depreciation = [], total = [];

    // Header row is at index 6 (the 7th row)
    const headerRow = overviewSheet[6];
    for (let i = 0; i < headerRow.length; i++) {
        const colName = headerRow[i];
        if (!colName) continue; // skip empty cells

        const normalized = colName.trim().toLowerCase();
        if (normalized === 'revenue') revCol = i;
        else if (normalized === 'costs') costsCol = i;
        else if (normalized === 'expenses') expensesCol = i;
        else if (normalized === 'depreciation') depCol = i;
        else if (normalized === 'total') totalCol = i;
    }

    // Data starts at index 7 (the 8th row)
    for (let i = 7; i < overviewSheet.length; i++) {
        const row = overviewSheet[i];
        if (!row || row.length === 0) continue; // skip empty rows

        if (revCol !== undefined) revenue.push(row[revCol] ?? null);
        if (costsCol !== undefined) costs.push(row[costsCol] ?? null);
        if (expensesCol !== undefined) expenses.push(row[expensesCol] ?? null);
        if (depCol !== undefined) depreciation.push(row[depCol] ?? null);
        if (totalCol !== undefined) total.push(row[totalCol] ?? null);
    }

    return {
        revenue,
        costs,
        expenses,
        depreciation,
        total
    };
}

function getRevenueData(sheet) {
    const headerRow = sheet[5]; // This is the row with actual column labels
    const dataStartIndex = 6;

    const productsAndServices = {};
    const totals = [];

    // First create a map of column indexes to their normalized keys
    const columnMap = {};
    
    for (let i = 2; i < headerRow.length; i++) {
        const label = headerRow[i];
        if (!label) continue;

        const normalizedKey = label.trim().toLowerCase();
        
        if (normalizedKey === 'total') {
            columnMap[i] = { type: 'total' };
        } else if (normalizedKey !== 'products') { // Skip the "Products" label
            columnMap[i] = { type: 'product', key: normalizedKey };
            productsAndServices[normalizedKey] = [];
        }
    }

    // Then collect data using the column map
    for (let i = dataStartIndex; i < sheet.length; i++) {
        const row = sheet[i];
        
        for (const [colIndex, mapping] of Object.entries(columnMap)) {
            const numIndex = Number(colIndex);
            const value = row[numIndex] ?? null;
            
            if (mapping.type === 'total') {
                totals.push(value);
            } else if (mapping.type === 'product') {
                productsAndServices[mapping.key].push(value);
            }
        }
    }

    return {
        productsAndServices,
        totals
    };
}


function getCostsData(sheet) {
    const headerRow = sheet[5]; // Row with category labels
    const columnLabels = sheet[5]; // Actual column names (like "Employee #1", "Cybersecurity", etc.)
    const dataStartIndex = 6;

    const salaries = {};
    const fixedCosts = {};
    const variableCosts = {};
    const total = [];

    // Track current categories
    let currentCategory = null;

    // Map column index to category and subkey
    const columnMap = {};

    for (let i = 5; i < headerRow.length; i++) {
        const label = columnLabels[i];

        if (!label) continue; // Skip empty labels, they're category markers

        const normalized = label.trim().toLowerCase();

        if (normalized === "salaries") currentCategory = "salaries";
        else if (normalized === "fixed costs") currentCategory = "fixedCosts";
        else if (normalized === "variable costs") currentCategory = "variableCosts";
        else if (normalized === "total") {
            currentCategory = "total";
            columnMap[i] = { category: "total" };
        }
        // else if (normalized === "leftover") {
        //     columnMap[i] = { category: "variableCosts", subKey: "leftover" };
        // }
        // else if (normalized === "used") {
        //     columnMap[i] = { category: "variableCosts", subKey: "used" };
        // }
        else if (currentCategory && currentCategory !== "total") {
            // All other labels should go under their current category
            const subKey = label.trim().replace(/\s+/g, '_');
            columnMap[i] = { category: currentCategory, subKey: subKey };
        }
    }

    // Populate data into categories
    for (let i = dataStartIndex; i < sheet.length; i++) {
        const row = sheet[i];

        for (const [colIndexStr, { category, subKey }] of Object.entries(columnMap)) {
            const colIndex = parseInt(colIndexStr);
            const value = row[colIndex] ?? null;

            if (category === "total") {
                total.push(value);
            } else {
                if (category === "salaries") {
                    if (!salaries[subKey]) salaries[subKey] = [];
                    salaries[subKey].push(value);
                } else if (category === "fixedCosts") {
                    if (!fixedCosts[subKey]) fixedCosts[subKey] = [];
                    fixedCosts[subKey].push(value);
                } else if (category === "variableCosts") {
                    if (!variableCosts[subKey]) variableCosts[subKey] = [];
                    variableCosts[subKey].push(value);
                }
            }
        }
    }

    return {
        salaries,
        fixedCosts,
        variableCosts,
        total
    };
}


function getExpensesData(sheet) {
    const headerRow = sheet[5]; // Row with category labels like "Salaries", "Expenses", etc.
    const columnLabels = sheet[5]; // Full column labels
    const dataStartIndex = 6;

    const salaries = {};
    const expenses = {};
    const total = [];

    let currentCategory = null;
    const columnMap = {};

    for (let i = 2; i < headerRow.length; i++) {
        const label = columnLabels[i];
        if (!label) continue;

        const normalized = label.trim().toLowerCase();

        if (normalized === "salaries") {
            currentCategory = "salaries";
        } else if (normalized === "expenses") {
            currentCategory = "expenses";
        } else if (normalized === "total") {
            currentCategory = "total";
            columnMap[i] = { category: "total" };
        } else if (currentCategory === "salaries") {
            columnMap[i] = { category: "salaries", subKey: label.trim().replace(/\s+/g, "_") };
        } else if (currentCategory === "expenses") {
            columnMap[i] = { category: "expenses", subKey: label.trim().replace(/\s+/g, "_") };
        }
    }

    for (let i = dataStartIndex; i < sheet.length; i++) {
        const row = sheet[i];

        for (const [colIndexStr, { category, subKey }] of Object.entries(columnMap)) {
            const colIndex = parseInt(colIndexStr);
            const value = row[colIndex] ?? null;

            if (category === "total") {
                total.push(value);
            } else if (category === "salaries") {
                if (!salaries[subKey]) salaries[subKey] = [];
                salaries[subKey].push(value);
            } else if (category === "expenses") {
                if (!expenses[subKey]) expenses[subKey] = [];
                expenses[subKey].push(value);
            }
        }
    }

    return {
        salaries,
        expenses,
        total
    };
}

function getAccountsData(sheet) {
    const headerRow = sheet[6]; // 6th row (0-indexed as 5) with account labels
    const dataStartIndex = 7; // Data starts from the next row
    const result = {
        receivables: {},
        payables: {},
        months: []
    };

    let currentCategory = null;
    const columnMap = {};

    // First pass: identify columns and their categories
    for (let i = 1; i < headerRow.length; i++) {
        const label = headerRow[i] ? headerRow[i].trim() : '';
        
        if (!label) continue;

        if (label.toLowerCase() === "months") {
            columnMap[i] = { category: "months" };
        } else if (label.toLowerCase() === "payable" || label.toLowerCase() === "payables") {
            currentCategory = "payables";
        } else if (label.toLowerCase() === "receivable" || label.toLowerCase() === "receivables") {
            currentCategory = "receivables";
        } else if (currentCategory === "payables") {
            columnMap[i] = { category: "payables", accountName: label };
        } else if (currentCategory === "receivables") {
            columnMap[i] = { category: "receivables", accountName: label };
        }
    }

    // Check if we should disregard the sheet (no accounts registered)
    const shouldDisregard = headerRow.some(cell => 
        cell && typeof cell === 'string' && 
        cell.toLowerCase().includes('disregard') && 
        cell.toLowerCase().includes('no accounts')
    );

    if (shouldDisregard) {
        return {
            receivables: {},
            payables: {},
            months: [],
            shouldDisregard: true
        };
    }

    // Second pass: collect data
    for (let i = dataStartIndex; i < sheet.length; i++) {
        const row = sheet[i];

        for (const [colIndexStr, mapping] of Object.entries(columnMap)) {
            const colIndex = parseInt(colIndexStr);
            const value = row[colIndex] ?? null;

            if (mapping.category === "months") {
                if (value !== null && value !== "") {
                    result.months.push(value);
                }
            } else if (mapping.category === "payables") {
                if (!result.payables[mapping.accountName]) {
                    result.payables[mapping.accountName] = [];
                }
                result.payables[mapping.accountName].push(value);
            } else if (mapping.category === "receivables") {
                if (!result.receivables[mapping.accountName]) {
                    result.receivables[mapping.accountName] = [];
                }
                result.receivables[mapping.accountName].push(value);
            }
        }
    }

    return result;
}


export const processExcelData = (initialData) => {
    console.log(initialData)

    const overviewSheet = initialData.Overview
    const bizInfo = getBizInfo(overviewSheet)

    const overviewData = getOverviewData(overviewSheet)

    const revenueSheet = initialData.Revenue
    const revenueData = getRevenueData(revenueSheet)

    const costsSheet = initialData.Costs
    const costsData = getCostsData(costsSheet)

    const expensesSheet = initialData.Expenses
    const expensesData = getExpensesData(expensesSheet)

    const accountSheet = initialData.Accounts
    const accountsData = getAccountsData(accountSheet)

    console.log("Results of processing")
    console.log(bizInfo)
    console.log(overviewData)
    console.log(revenueData)
    console.log(costsData)
    console.log(expensesData)

    return [bizInfo, overviewData, revenueData, costsData, expensesData]
}




export const getStatements = (bizInfo, overviewData, revenueData, costsData, expensesData) => {
    let result = {};
    const od = overviewData;

    for (let i = 0; i < bizInfo.months.length; i++) {
        const month = bizInfo.months[i];
        
        // Convert all values to absolute (positive) numbers
        const revenue = Math.abs(Number(od.revenue?.[i] ?? 0));
        const costs = Math.abs(Number(od.costs?.[i] ?? 0));
        const expenses = Math.abs(Number(od.expenses?.[i] ?? 0));
        const dep = Math.abs(Number(od.depreciation?.[i] ?? 0));

        // Simple subtraction calculations
        const gross = (revenue - costs).toFixed(0);
        const totalOp = (expenses + dep).toFixed(0);
        const operating = (gross - expenses - dep).toFixed(0);
        const net = operating

        result[month] = {
            revenue: revenue.toFixed(0),
            costs: costs.toFixed(0),
            expenses: expenses.toFixed(0),
            dep: dep.toFixed(0),
            gross: gross,
            totalOp: totalOp,
            operating: operating,
            net: net
        };
    }

    console.log("result of getStatements", result);
    return result;
};