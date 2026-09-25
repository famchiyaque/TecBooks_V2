import React from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Box,
  Chip,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { cashFlowEditsSlice, outflowEditsSlice } from "@/store/costTable.store";
import {
  computeTrema,
  computeNPV,
  computeIRR,
  decideProject,
} from "@/utils/dashboard/financialEvaluation";
import { buildCostOfSales } from "./buildCostOfSales";
import { cbmToOperatingExpenseInputs } from "./cbmToCostTableInputs";
import { ENTRADA_ROWS, baseEntradaValue } from "./cashFlowCalculations";
import {
  buildOutflowRows,
  computeCapexByYear,
  outflowBaseValue,
} from "./outflowCalculations";
import { computeCashBalanceByYear } from "@/sims/project-feasibility/costTable/cashFlowCalculations.js";

function formatCurrency(value) {
  const num = Number(value) || 0;
  return `$${num.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPct(value) {
  return `${(Number(value) * 100).toFixed(2)}%`;
}

// Stores the rate as a decimal fraction (0.10 = 10%) but lets the user edit
// in whole-percent terms (10 = 10%) with a % suffix - no decimal confusion.
function PercentField({ label, value, onChange, helperText }) {
  return (
    <TextField
      label={label}
      type="number"
      size="small"
      fullWidth
      value={Number.isFinite(value) ? Number((value * 100).toFixed(2)) : 0}
      onChange={(event) => onChange(Number(event.target.value) / 100 || 0)}
      helperText={helperText}
      slotProps={{
        input: {
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        },
      }}
    />
  );
}

function Stat({ label, value, highlight }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        bgcolor: highlight ? "#fff4d6" : "rgba(7, 58, 90, 0.04)",
        border: "1px solid",
        borderColor: highlight ? "#f0c419" : "rgba(7, 58, 90, 0.1)",
      }}
    >
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700, color: "#073a5a" }}>
        {value}
      </Typography>
    </Box>
  );
}

/**
 * RF-65 (TREMA) + RF-66 (TIR/VNA) + RF-67 (accept/reject decision, absorbed
 * into RF-66's own activity diagram - no separate flow for it). Market Rate
 * and Inflation come from Premisas; Risk Premium has no source field
 * anywhere in InputNovus (same situation as RF-56's Financial Income), so
 * it's a manual input like Break-even's "Desired profit" field.
 *
 * The reference activity diagram for RF-65 literally lists "Large Loan =
 * Amount / Extract Salaries / Extract Bank Payments / Extract Taxes / Sum
 * them" - that's RF-56's financing-amount recipe, not a TREMA formula, and
 * doesn't match the reference spreadsheet's own TREMA table (Market Rate +
 * Inflation + Risk Premium). Implemented against the spreadsheet, which is
 * the only internally-consistent source of the two.
 *
 * Cash flow series for VNA/TIR = Total Cash Inflows - Total Cash Outflows
 * per year (same "Flujo Neto" the Cash Table's own Beginning Balance chain
 * is built from) - reads both edits slices directly so it stays live
 * against overrides made in either table, same as Profit Summary does.
 */
function ProjectEvaluationSummary({ project }) {
  const [riskPremium, setRiskPremium] = React.useState(0.1);
  const [marketRate, setMarketRate] = React.useState(0);
  const [inflation, setInflation] = React.useState(0);

  const entradaOverrides = useSelector(cashFlowEditsSlice.selectOverrides);
  const entradaCustomRows = useSelector(cashFlowEditsSlice.selectCustomRows);
  const outflowOverrides = useSelector(outflowEditsSlice.selectOverrides);
  const outflowCustomRows = useSelector(outflowEditsSlice.selectCustomRows);

  const result = React.useMemo(() => buildCostOfSales(project.cbm), [project]);

  const years = React.useMemo(
    () => (result.error ? [] : result.costOfSalesByYear.map((row) => row.year)),
    [result],
  );
  const rowByYear = React.useMemo(() => {
    if (result.error) return {};
    return Object.fromEntries(
      result.costOfSalesByYear.map((row) => [row.year, row]),
    );
  }, [result]);
  const capexByYear = React.useMemo(
    () => (result.error ? {} : computeCapexByYear(project.cbm, years)),
    [project, result, years],
  );
  const outflowRows = React.useMemo(
    () => buildOutflowRows(project.cbm),
    [project],
  );
  const opex = React.useMemo(
    () => cbmToOperatingExpenseInputs(project.cbm, years),
    [project, years],
  );

  const loadedMarketRate = opex.nationalLeadingRate[years[0]] || 0;
  const loadedInflation = opex.nationalInflation[years[0]] || 0;

  React.useEffect(() => {
    setMarketRate(loadedMarketRate);
    setInflation(loadedInflation);
  }, [loadedMarketRate, loadedInflation]);

  if (result.error) {
    return <Alert severity="warning">{result.error}</Alert>;
  }

  const { endingBalanceByYear } = computeCashBalanceByYear(project.cbm);
  const netCashFlowByYear = Object.values(endingBalanceByYear);

  const trema = computeTrema(marketRate, inflation, riskPremium);
  const npv = computeNPV(netCashFlowByYear, trema);
  const irr = computeIRR(netCashFlowByYear);
  console.log({ trema, irr, npv });
  const decision = decideProject(npv, irr, trema);

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ opacity: 0.7, display: "block", mb: 2 }}
      >
        Based on the project's full {years.length}-year cash flow ({years[0]}-
        {years[years.length - 1]})
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              height: "100%",
              bgcolor: "rgba(7, 58, 90, 0.04)",
              border: "1px solid rgba(7, 58, 90, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <PercentField
              label="Best Market Interest Rate"
              value={marketRate}
              onChange={setMarketRate}
            />
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              height: "100%",
              bgcolor: "rgba(7, 58, 90, 0.04)",
              border: "1px solid rgba(7, 58, 90, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <PercentField
              label="Inflation"
              value={inflation}
              onChange={setInflation}
            />
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat label="TREMA" value={formatPct(trema)} highlight />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat
            label="TIR"
            value={irr === null ? "N/A" : formatPct(irr)}
            highlight
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Stat label="VNA (NPV)" value={formatCurrency(npv)} highlight />
        </Grid>
        <Grid item xs={6} sm={3} sx={{ display: "flex", alignItems: "center" }}>
          <Chip
            label={decision.accepted ? "Project Accepted" : "Project Rejected"}
            color={decision.accepted ? "success" : "error"}
            sx={{ fontWeight: 700 }}
          />
        </Grid>
      </Grid>

      {decision.reason && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {decision.reason}
        </Alert>
      )}

      <Box sx={{ mt: 3, maxWidth: 240 }}>
        <PercentField
          label="Risk Premium"
          value={riskPremium}
          onChange={setRiskPremium}
          helperText="No source field in InputNovus - enter as a percentage (e.g. 10 = 10%)"
        />
      </Box>
    </Box>
  );
}

export default ProjectEvaluationSummary;
