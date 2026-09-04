import React from 'react'
import { Alert, Box, Grid, TextField, Typography } from '@mui/material'
import { buildCostOfSales } from './buildCostOfSales'
import { cbmToCostTableInputs } from './cbmToCostTableInputs'

function formatCurrency(value) {
  const num = Number(value) || 0
  return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatUnits(value) {
  const num = Number(value) || 0
  return num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function Stat({ label, value, highlight }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        height: '100%',
        bgcolor: highlight ? '#fff4d6' : 'rgba(7, 58, 90, 0.04)',
        border: '1px solid',
        borderColor: highlight ? '#f0c419' : 'rgba(7, 58, 90, 0.1)',
      }}
    >
      <Typography variant="caption" sx={{ opacity: 0.7 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 700, color: '#073a5a' }}>{value}</Typography>
    </Box>
  )
}

/**
 * Break-even for the project's first year, mirroring "Punto de Equilibrio"
 * from Estado R (rows 49-60) in Template Financiero IN3001B - but computed
 * from the same validated buildCostOfSales pipeline the Cost Table/Profit
 * Summary already use, instead of re-deriving from raw cbm fields.
 *
 * Fixed costs = Administrative Expenses + indirect/engineering salaries +
 * Credit Payment (the template's own row 51 pointed at the wrong cell -
 * Gastos Financieros instead of Gastos Administrativos - so this uses the
 * Administrative Expenses value already computed for the Income Statement,
 * which is what row 51's label actually means).
 * Variable cost/unit = material cost/unit + (direct labor / units that year),
 * same simplification the template itself makes (row 59).
 */
function BreakEvenSummary({ project }) {
  const [desiredProfit, setDesiredProfit] = React.useState(0)

  const result = React.useMemo(() => buildCostOfSales(project.cbm), [project])
  const { production } = React.useMemo(() => cbmToCostTableInputs(project.cbm), [project])

  if (result.error) {
    return <Alert severity="warning">{result.error}</Alert>
  }

  const row = result.costOfSalesByYear[0]
  const annualCapacity = project.cbm.derivedBase?.annualCapacity || 0
  const salePrice = production.salesPricePerUnit || 0

  const fixedCosts = row.administrativeExpenses + row.indirectManufacturing
    + row.engineeringSalaries + row.creditPayment
  const variableCostPerUnit = (production.materialCostPerUnit || 0)
    + (annualCapacity > 0 ? row.directLabour / annualCapacity : 0)
  const contributionMargin = salePrice - variableCostPerUnit

  if (contributionMargin <= 0) {
    return (
      <Alert severity="warning">
        Sale price ({formatCurrency(salePrice)}) must be higher than the variable cost
        per unit ({formatCurrency(variableCostPerUnit)}) to compute a break-even point.
      </Alert>
    )
  }

  const breakEvenUnits = fixedCosts / contributionMargin
  const breakEvenRevenue = breakEvenUnits * salePrice
  const unitsForProfit = (fixedCosts + desiredProfit) / contributionMargin
  const revenueForProfit = unitsForProfit * salePrice

  return (
    <Box>
      <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 2 }}>
        Based on {row.year}, this project's first year
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Stat label="Annual Fixed Costs" value={formatCurrency(fixedCosts)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat label="Variable Cost / Unit" value={formatCurrency(variableCostPerUnit)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat label="Sale Price" value={formatCurrency(salePrice)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat label="Break-even Units" value={formatUnits(breakEvenUnits)} highlight />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat label="Break-even Revenue" value={formatCurrency(breakEvenRevenue)} highlight />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, mb: 2 }}>
        <TextField
          label="Desired profit"
          type="number"
          size="small"
          value={desiredProfit}
          onChange={(event) => setDesiredProfit(Number(event.target.value) || 0)}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Stat label="Units for Desired Profit" value={formatUnits(unitsForProfit)} highlight />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat label="Revenue for Desired Profit" value={formatCurrency(revenueForProfit)} highlight />
        </Grid>
      </Grid>
    </Box>
  )
}

export default BreakEvenSummary
