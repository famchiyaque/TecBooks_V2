# Mexico Manufacturing Template Specification

## Overview

This document specifies the exact structure of the Mexico Manufacturing Excel template and how it maps to the canonical business model.

## Template Structure

The template consists of 8 sheets:
1. Welcome
2. 1_Premises
3. 2_BOMs
4. 3_Assets
5. 4_Production
6. 5_Workforce
7. 6_Expenses
8. 7_Financing

---

## Sheet 1: Welcome

### Purpose
Identifies the template type and contains basic business information.

### Structure

| Cell | Content | Description |
|------|---------|-------------|
| A1 | `"manufacturing"` | Business type |
| B1 | `"mexico"` | Country |
| C16 | Business name | Optional, defaults to "Unnamed Business" if empty |

### Mapping to Canonical Model
```javascript
model.metadata.type = welcomeSheet[0][0]        // A1
model.metadata.country = welcomeSheet[0][1]     // B1
model.metadata.name = welcomeSheet[15][2]       // C16
```

---

## Sheet 2: 1_Premises

### Purpose
Financial assumptions, rates, and economic parameters.

### Structure

All values are in pairs: **Column B** (Label) | **Column C** (Value)

Starting at row 10 (index 9):

| Row | Cell | Label | Value Cell | Maps to |
|-----|------|-------|-----------|---------|
| 10 | B10 | Interest Rate | C10 | `premises.interestRate` |
| 11 | B11 | Inflation | C11 | `premises.inflationRate` |
| 12 | B12 | Business Income Tax | C12 | `premises.businessIncomeTax` |
| 13 | B13 | Employee Share of Profit (PTU) | C13 | `premises.employeeShareOfProfit` |
| 14 | B14 | Inventory Percentage | C14 | `premises.inventoryPercentage` |
| 15 | B15 | Provider Percentage | C15 | `premises.providerPercentage` |
| 16 | B16 | Short Term Passive | C16 | `premises.shortTermPassive` |
| 17 | B17 | Direct Product Costs | C17 | `premises.directProductCosts` |
| 18 | B18 | Indirect Product Costs | C18 | `premises.indirectProductCosts` |
| 19 | B19 | Sales Expenses | C19 | `premises.salesExpenses` |
| 20 | B20 | Administration Percentage | C20 | `premises.administrationPercentage` |
| 21 | B21 | Building Depreciation Rate | C21 | `premises.depreciationRates.building` |
| 22 | B22 | Machinery Depreciation Rate | C22 | `premises.depreciationRates.machinery` |
| 23 | B23 | Vehicle Depreciation Rate | C23 | `premises.depreciationRates.vehicle` |
| 24 | B24 | Computer Equipment Dep. Rate | C24 | `premises.depreciationRates.computerEquipment` |
| 25 | B25 | Machinery Installation Rate | C25 | `premises.machineryInstallationRate` |
| 26 | B26 | Quality Improvement Rate | C26 | `premises.qualityImprovementRate` |
| 27 | B27 | Utilization Rate | C27 | `premises.utilizationRate` |
| 28 | B28 | IMSS | C28 | `premises.laborBenefits.imss` |
| 29 | B29 | INFONAVIT | C29 | `premises.laborBenefits.infonavit` |
| 30 | B30 | Vales de Despensa | C30 | `premises.laborBenefits.valesDespensa` |
| 31 | B31 | Aguinaldo | C31 | `premises.laborBenefits.aguinaldo` |
| 32 | B32 | Fondo de Ahorro | C32 | `premises.laborBenefits.fondoAhorro` |
| 33 | B33 | Comedor | C33 | `premises.laborBenefits.comedor` |

---

## Sheet 3: 2_BOMs

### Purpose
Bills of Materials for each product (components, costs, sales prices).

### Structure

**Product Information:**
- `C1` = Product Name
- `E11` = Sales Price

**BOM Blocks:** Starting at row 11 (index 10), each product has a block:

| Column | Content |
|--------|---------|
| B | Part Name |
| C | Quantity |
| D | Cost per Unit |
| E | Subtotal (Quantity × Cost) |

**Part rows start at row 13 (index 12):**
- B13, C13, D13, E13 = First part
- B14, C14, D14, E14 = Second part
- ... continues until empty row

**Empty row** separates blocks (different products).

### Example
```
Row 11: [blank] [Product Block Start] ...
Row 12: Headers
Row 13: [blank] [Part 1] [Qty] [Cost] [Subtotal]
Row 14: [blank] [Part 2] [Qty] [Cost] [Subtotal]
Row 15: [blank] [blank] ... (empty = end of this BOM)
Row 16: [blank] [Next Product Block] ...
```

### Mapping
```javascript
model.boms = [
  {
    name: sheet[0][2],           // C1
    salesPrice: sheet[10][4],    // E11
    parts: [
      {
        name: sheet[12][1],      // B13
        quantity: sheet[12][2],  // C13
        cost: sheet[12][3],      // D13
        subtotal: sheet[12][4],  // E13
      },
      // ... more parts
    ]
  },
  // ... more BOMs
]
```

---

## Sheet 4: 3_Assets

### Purpose
List of fixed assets by category.

### Structure

Four categories in parallel columns, each with Name/Cost pairs:

| Category | Name Column | Cost Column | Starting Row |
|----------|-------------|-------------|--------------|
| **Machinery** | B | C | 11 (index 10) |
| **Vehicles** | E | F | 11 (index 10) |
| **Buildings** | H | I | 11 (index 10) |
| **Computer Equipment** | K | L | 11 (index 10) |

Each category continues until an empty row is found.

### Example
```
Row 11: [B11: Machine 1] [C11: 50000] ... [E11: Truck 1] [F11: 30000] ...
Row 12: [B12: Machine 2] [C12: 75000] ... [E12: blank] [F12: blank] ...
Row 13: [B13: blank] [C13: blank] ... (end of machines, continue vehicles)
```

### Mapping
```javascript
model.assets = {
  machinery: [{ name: sheet[10][1], cost: sheet[10][2] }, ...],
  vehicles: [{ name: sheet[10][4], cost: sheet[10][5] }, ...],
  buildings: [{ name: sheet[10][7], cost: sheet[10][8] }, ...],
  computerEquipment: [{ name: sheet[10][10], cost: sheet[10][11] }, ...],
}
```

---

## Sheet 5: 4_Production

### Purpose
Production capacity and demand parameters.

### Structure

**Production Parameters** (Column B = Label, Column C = Value):

| Row | Cell | Label | Value Cell | Maps to |
|-----|------|-------|-----------|---------|
| 13 | B13 | Quality Yield | C13 | `production.qualityYield` |
| 14 | B14 | Units/Hour | C14 | `production.unitsPerHour` |
| 15 | B15 | Hours/Shift | C15 | `production.hoursPerShift` |
| 16 | B16 | Number of Shifts | C16 | `production.numberOfShifts` |
| 17 | B17 | Number of Lines | C17 | `production.numberOfLines` |
| 18 | B18 | Days/Week | C18 | `production.daysPerWeek` |
| 19 | B19 | Weeks/Month | C19 | `production.weeksPerMonth` |
| 20 | B20 | Months/Year | C20 | `production.monthsPerYear` |

**Demand Parameters:**

| Row | Description | Units (Col C) | Months (Col D) | Maps to |
|-----|-------------|---------------|----------------|---------|
| 24 | First Year (Incomplete) | C24 | D24 | `production.firstYearDemand` |
| 25 | First Full Year | C25 | D25 (should be 12) | `production.firstFullYearDemand` |

---

## Sheet 6: 5_Workforce

### Purpose
Monthly salary costs by labor category.

### Structure

| Row | Cell | Label | Value Cell | Maps to |
|-----|------|-------|-----------|---------|
| 41 | | Direct Labor Salaries | D41 | `workforce.directLaborSalaries` |
| 42 | | Indirect Labor Salaries | D42 | `workforce.indirectLaborSalaries` |
| 43 | | Engineering Salaries | D43 | `workforce.engineeringSalaries` |
| 44 | | Administrative Salaries | D44 | `workforce.administrativeSalaries` |

### Mapping
```javascript
model.workforce = {
  directLaborSalaries: sheet[40][3],     // D41
  indirectLaborSalaries: sheet[40][3],   // D42
  engineeringSalaries: sheet[42][3],     // D43
  administrativeSalaries: sheet[43][3],  // D44
}
```

---

## Sheet 7: 6_Expenses

### Purpose
Monthly operating expenses.

### Structure

Pair list starting at row 12 (index 11):

| Column | Content |
|--------|---------|
| B | Expense Name |
| C | Monthly Estimated Cost |

Continues until empty row.

### Example
```
Row 12: [B12: Utilities] [C12: 5000]
Row 13: [B13: Insurance] [C13: 2000]
Row 14: [B14: Marketing] [C14: 10000]
Row 15: [B15: blank] (empty = end)
```

### Mapping
```javascript
model.expenses = [
  { name: sheet[11][1], monthlyCost: sheet[11][2] },
  { name: sheet[12][1], monthlyCost: sheet[12][2] },
  // ... continues
]
```

---

## Sheet 8: 7_Financing

### Purpose
Initial capital and loan information.

### Structure

| Row | Cell | Description | Maps to |
|-----|------|-------------|---------|
| 11 | C11 | Initial Investment | `financing.initialInvestment` |
| 13 | C13 | Loan Amount | `financing.loan.amount` |
| 13 | E13 | Loan Periods (months) | `financing.loan.periods` |
| 14 | C14 | Loan Interest Rate | `financing.loan.interestRate` |

### Mapping
```javascript
model.financing = {
  initialInvestment: sheet[10][2],  // C11
  loan: {
    amount: sheet[12][2],           // C13
    periods: sheet[12][4],          // E13
    interestRate: sheet[13][2],     // C14
  }
}
```

---

## Adapter Implementation

The adapter is located at:
```
src/core/adapters/MexicoManufacturingAdapter.js
```

### Detection Logic

The adapter is automatically selected when the Excel file contains a sheet named `"Welcome"`.

### Usage

```javascript
import { adaptMexicoManufacturingToBusinessModel } from '@/core/adapters';

const businessModel = adaptMexicoManufacturingToBusinessModel(excelData);
```

---

## Validation Rules

1. **Required Sheets:** All 8 sheets must be present
2. **Business Name:** If C16 in Welcome is empty, defaults to "Unnamed Business"
3. **BOM Validation:** At least one BOM with at least one part
4. **Numeric Fields:** All numeric values are sanitized (null/undefined → 0)
5. **Empty Rows:** Empty rows indicate end of lists/blocks

---

## Testing Checklist

- [ ] Welcome sheet: A1, B1, C16 are read correctly
- [ ] Premises: All 25 parameters extracted
- [ ] BOMs: Multiple products with parts extracted
- [ ] Assets: All 4 categories extracted
- [ ] Production: 8 parameters + 2 demand rows extracted
- [ ] Workforce: 4 salary types extracted
- [ ] Expenses: Variable list extracted correctly
- [ ] Financing: Investment and loan info extracted
- [ ] Empty rows properly end lists
- [ ] Missing/null values default to 0

---

## Next Steps

After adapter processes the template:
1. **Derived Values Calculation** - Calculate monthly projections
2. **Timeline Generation** - Create month-by-month timeline
3. **Revenue Projections** - Based on demand and sales prices
4. **Cost Projections** - Based on BOMs and production volumes
5. **Financial Statements** - Income, Balance, Cashflow
6. **Project Metrics** - IRR, NPV, ROI, Break-even
