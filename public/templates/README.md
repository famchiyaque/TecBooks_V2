# Excel Templates

This folder contains Excel templates for different business types and countries.

## Adding Your Manufacturing Template

Place your manufacturing Excel template here with the filename: `manufacturing-mexico-template.xlsx`

## Template Structure

Each template should follow this structure:

### Required Sheets:
1. **Overview** - Summary of revenue, costs, expenses, depreciation
2. **Revenue** - Detailed revenue streams by product/service
3. **Costs** - Detailed cost breakdown (salaries, fixed costs, variable costs)
4. **Expenses** - Operating expenses breakdown
5. **Accounts** - Accounts receivable and payable (optional)

### Real-time Data Integration

For templates that need real-time data (like inflation rates, PTU values), you can add custom methods in:
`src/modules/excel-templates/dataFetchers/`

Example structure:
```javascript
// mexicoDataFetcher.js
export async function fetchInflationRate() {
  // Fetch from INEGI or other source
  return inflationRate;
}

export async function fetchPTURate() {
  // Fetch current PTU percentage
  return ptuRate;
}
```

Then integrate these in the template generation process before download.

## Template Guidelines

- Use consistent column headers across all templates
- Include data validation where appropriate
- Add instructions sheet for users
- Test with the ExcelAdapter to ensure compatibility
