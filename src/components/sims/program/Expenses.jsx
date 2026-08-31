import React from "react";
import { Box } from "@mui/material";
import AdminExpensesTable from "./expenses/AdminExpensesTable";
import InvestmentTable from "./expenses/InvestmentTable";
import FinancialExpensesTable from "./expenses/FinancialExpensesTable";
import ServicesTable from "./expenses/ServicesTable";

/**
 * Expenses
 * ----------------------------------------------------------------------
 * Displays, in the same visual language as the "Resultados Financieros"
 * screens (light card, thin borders, pale-green table headers, red/green
 * signed currency), four blocks of information coming from the DB:
 *
 *  1. Gastos Administrativos  -> one row, spread across every year
 *  2. Inversión                -> list of concepts + amounts (initial outlay)
 *  3. Gastos Financieros       -> several concepts spread across every year
 *  4. Servicios                -> separate table, grouped by category,
 *                                 and fully adaptable to however many
 *                                 rows the DB returns.
 *
 * Every block is driven by props. If a prop is omitted, illustrative
 * sample data (matching the shape of the source spreadsheets) is used
 * so the screen still renders sensibly while wiring up the API.
 * ----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------
// Sample data (used only as a fallback so the component is self-contained)
// ---------------------------------------------------------------------

import {
  SAMPLE_YEARS,
  SAMPLE_ADMIN_EXPENSES,
  SAMPLE_INVESTMENT,
  SAMPLE_FINANCIAL_EXPENSES,
  SAMPLE_SERVICES,
} from "@/api/sims/expenses/getExpenses.service";

// ---------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------

function Expenses({
  years = SAMPLE_YEARS,
  adminExpenses = SAMPLE_ADMIN_EXPENSES,
  investment = SAMPLE_INVESTMENT,
  financialExpenses = SAMPLE_FINANCIAL_EXPENSES,
  services = SAMPLE_SERVICES,
}) {
  return (
    <Box sx={{ mt: 3 }}>
      <AdminExpensesTable years={years} expenses={adminExpenses} />
      <InvestmentTable items={investment} />
      <FinancialExpensesTable years={years} items={financialExpenses} />
      <ServicesTable services={services} />
    </Box>
  );
}

export default Expenses;
