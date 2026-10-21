import React from "react";
import EditableTable from "@/components/global/EditableTable";
import { equitySlice } from "@/store/balance.store";
import useEffectiveBalanceTotals from "@/sims/project-feasibility/balance/useEffectiveBalanceTotals.js";
import { computeEquity } from "@/sims/project-feasibility/balance/computeEquity.js";
import useTableRowsSync from "@/hooks/sims/project/useTableRowsSync.js";

const EQUITY_ROWS = [
  { key: "legacy", label: "Legacy" },
  { key: "periodUtility", label: "Period Utility" },
  { key: "acumUtility", label: "Acum period utility" },
];

/**
 * "Legacy" is the balancing plug: Total Assets - Total Liabilities - this
 * period's/accumulated utility, computed from useEffectiveBalanceTotals'
 * EFFECTIVE (override + custom-row aware) totals - not the raw CBM-only
 * numbers computeActives/computePassives return. So adding a row in Current
 * Actives/Defered Actives/Current Passives/Long term passives now actually
 * moves Shareholder's Equity, not just its own table's total.
 */
function Equity({ project, currency }) {
  useTableRowsSync(project.gameId, equitySlice, "equity");
  const cbm = project.cbm;
  const years = cbm.timeline.years;
  const totalsByYear = useEffectiveBalanceTotals(cbm, project.gameId);

  const { legacy, periodUtility, acumUtility } = computeEquity(totalsByYear, years);
  const equityByRow = { legacy, periodUtility, acumUtility };
  const columns = years.map((year) => ({ key: year, label: year }));
  const getValue = (rowKey, year) => equityByRow[rowKey]?.[year] ?? 0;

  return (
    <EditableTable
      title="Shareholder's equity"
      slice={equitySlice}
      columns={columns}
      rows={EQUITY_ROWS}
      getValue={getValue}
      totalLabel="Total Shareholder's equity"
      currency={currency}
    />
  );
}

export default Equity;
