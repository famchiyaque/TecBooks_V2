import React from "react";
import { Alert, Box, Grid, TextField } from "@mui/material";
import { buildCostOfSales } from "./buildCostOfSales";
import { cbmToCostTableInputs } from "./cbmToCostTableInputs";
import BreakEvenChart from "./BreakEvenChart";

function formatCurrency(value) {
  const num = Number(value) || 0;
  return `$${num.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatUnits(value) {
  const num = Number(value) || 0;
  return num.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function Stat({ label, value, highlight }) {
  return (
    <div
      className={`h-full rounded-xl border p-3 ${
        highlight ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50/60"
      }`}
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-[15px] font-semibold text-slate-900 tabular-nums">{value}</p>
    </div>
  );
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
 * Variable cost/unit = material cost/unit + (direct labor / annual
 * capacity) - annual capacity, not year-zero's order volume, since a
 * ramp-up year's low order count would badly distort a per-unit labor cost
 * (matches the template's own Capacidad!E17 divisor, row 59).
 */
function BreakEvenSummary({ project }) {
  const [desiredProfit, setDesiredProfit] = React.useState(500000);

  const result = React.useMemo(() => buildCostOfSales(project.cbm), [project]);
  const { production } = React.useMemo(
    () =>
      project.cbm ? cbmToCostTableInputs(project.cbm) : { production: {} },
    [project],
  );

  if (result.error) {
    return <Alert severity="warning">{result.error}</Alert>;
  }

  const row = result.costOfSalesByYear[0];
  const annualCapacity =
    Object.values(production.purchaseOrders)[0] /
      Object.values(production.qualityYield)[0] || 0;

  const costPerUnit = Object.values(production.materialCostPerUnit)[0];
  const salePrice = production.salesPricePerUnit?.[row.year] || 0;

  const salaries =
    row.engineeringSalaries +
    row.administrativeSalary +
    row.indirectManufacturing;

  const creditPayment = row.creditPayment + row.financialExpenses;

  const fixedCosts = row.administrativeExpenses + salaries + creditPayment;

  const variableCostPerUnit =
    (costPerUnit || 0) +
    (annualCapacity > 0 ? row.directLabour / annualCapacity : 0);
  const contributionMargin = salePrice - variableCostPerUnit;

  if (contributionMargin <= 0) {
    return (
      <Alert severity="warning">
        Sale price ({formatCurrency(salePrice)}) must be higher than the
        variable cost per unit ({formatCurrency(variableCostPerUnit)}) to
        compute a break-even point.
      </Alert>
    );
  }

  const breakEvenUnits = fixedCosts / contributionMargin;
  const breakEvenRevenue = breakEvenUnits * salePrice;
  const unitsForProfit = (fixedCosts + desiredProfit) / contributionMargin;
  const revenueForProfit = unitsForProfit * salePrice;

  return (
    <Box>
      <p className="mb-3 text-sm text-slate-500">
        Break-even for {row.year}, this project's first year: fixed costs,
        variable cost per unit and the sales volume/revenue needed to cover
        them (plus your desired profit target).
      </p>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Stat label="Annual Fixed Costs" value={formatCurrency(fixedCosts)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat
            label="Variable Cost / Unit"
            value={formatCurrency(variableCostPerUnit)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat label="Sale Price" value={formatCurrency(salePrice)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat
            label="Break-even Units"
            value={formatUnits(breakEvenUnits)}
            highlight
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat
            label="Break-even Revenue"
            value={formatCurrency(breakEvenRevenue)}
            highlight
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat
            label="Units for Desired Profit"
            value={formatUnits(unitsForProfit)}
            highlight
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat
            label="Revenue for Desired Profit"
            value={formatCurrency(revenueForProfit)}
            highlight
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, mb: 2 }}>
        <TextField
          label="Desired profit"
          type="number"
          size="small"
          value={desiredProfit}
          onChange={(event) =>
            setDesiredProfit(Number(event.target.value) || 0)
          }
        />
      </Box>

      <BreakEvenChart
        fixedCosts={fixedCosts}
        variableCostPerUnit={variableCostPerUnit}
        salePrice={salePrice}
        breakEvenUnits={breakEvenUnits}
      />
    </Box>
  );
}

export default BreakEvenSummary;
