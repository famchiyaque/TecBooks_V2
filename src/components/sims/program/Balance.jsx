import React from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useBalance from "@/hooks/sims/project/useBalance";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import useEffectiveBalanceTotals from "@/sims/project-feasibility/balance/useEffectiveBalanceTotals.js";
import FixedAssetsTable from "@/components/dashboard/FixedAssetsTable";
import CurrentActives from "./balance/CurrentActives.jsx";
import DeferedActives from "./balance/DeferedActives.jsx";
import Passive from "./balance/Passive.jsx";
import Equity from "./balance/Equity.jsx";

const CELL_PAD = "px-2 py-2";

function formatCurrency(value) {
  const num = value || 0;
  return `$${num.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Matches the Template Financiero's Balance sheet totals: Total Activo =
// Activo Circulante + Activo Fijo (neto) + Activo Diferido. Renders the
// same override-aware totals useEffectiveBalanceTotals feeds the Ratios
// table and Shareholder's Equity, so Balance Sheet / Ratios can't drift.
const ACTIVES_TOTAL_ROWS = [
  { key: "currentActivesTotal", label: "Total Current Actives" },
  { key: "fixed", label: "Total Net Fixed Assets" },
  { key: "deferedActivesTotal", label: "Total Defered Actives" },
  { key: "totalActives", label: "Total Actives" },
];

function TotalActives({ project, actives }) {
  const cbm = project.cbm;
  const years = cbm.timeline.years;
  const totalsByYear = useEffectiveBalanceTotals(cbm);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const fixedNetValue = (year) =>
    actives.fixedAssets?.find((item) => String(item.year) === String(year))?.netValue || 0;

  const rowValue = (rowKey, year) =>
    rowKey === "fixed" ? fixedNetValue(year) : totalsByYear[year][rowKey];

  return (
    <CollapsibleSection title="Total Actives" defaultExpanded>
      <Table size="small" className="w-full border-collapse text-xs">
        <TableHead>
          <TableRow className="border-b border-slate-200 bg-slate-50/60">
            <TableCell className={`${CELL_PAD} whitespace-nowrap text-[11px] font-medium text-slate-500`}>
              Concept
            </TableCell>
            {years.map((year) => (
              <TableCell
                key={year}
                align="right"
                className={`${CELL_PAD} whitespace-nowrap text-[11px] font-medium text-slate-500`}
              >
                {year}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {ACTIVES_TOTAL_ROWS.map((row) => (
            <TableRow key={row.key} className={row.key === "totalActives" ? "bg-slate-100/80" : ""}>
              <TableCell
                className={`${CELL_PAD} whitespace-nowrap ${
                  row.key === "totalActives" ? "font-bold" : "font-medium"
                } text-slate-700`}
              >
                {row.key === "totalActives" ? (
                  <span className="inline-flex items-center gap-1">
                    <IconButton
                      size="small"
                      aria-label={isExpanded ? "collapse" : "expand"}
                      onClick={() => setIsExpanded((prev) => !prev)}
                      className="!p-0.5"
                    >
                      <ExpandMoreIcon
                        fontSize="small"
                        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </IconButton>
                    {row.label}
                  </span>
                ) : (
                  row.label
                )}
              </TableCell>
              {years.map((year) => (
                <TableCell
                  key={year}
                  align="right"
                  className={`${CELL_PAD} whitespace-nowrap tabular-nums ${
                    row.key === "totalActives" ? "font-bold" : ""
                  } text-slate-900`}
                >
                  {formatCurrency(rowValue(row.key, year))}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {isExpanded && (
            <TableRow className="bg-slate-50/50">
              <TableCell
                colSpan={years.length + 1}
                className="whitespace-nowrap py-1.5 pl-9 pr-2 italic text-slate-500"
              >
                = Total Current Actives + Total Net Fixed Assets + Total Defered Actives
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CollapsibleSection>
  );
}

function Balance({ project }) {
  const balance = useBalance(project);

  return (
    <div className="flex flex-col mt-3 p-3">
      <CollapsibleSection title="CurrentActives" defaultExpanded>
        <CurrentActives currentActives={balance.actives.currentActives} gameId={project.gameId} />
      </CollapsibleSection>

      <CollapsibleSection title="Fixed Assets" defaultExpanded>
        <FixedAssetsTable
          byCategory={balance.actives?.fixedAssetsByCategory}
          total={balance.actives?.fixedAssets}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Defered Actives">
        <DeferedActives deferedActives={balance.actives?.deferedActives} gameId={project.gameId} />
      </CollapsibleSection>

      <TotalActives project={project} actives={balance.actives} />

      <Passive passives={balance.passives} gameId={project.gameId} />

      <CollapsibleSection title="Shareholder's equity">
        <Equity project={project} />
      </CollapsibleSection>
    </div>
  );
}

export default Balance;
