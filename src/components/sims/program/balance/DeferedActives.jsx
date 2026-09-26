import React from "react";
import EditableTable from "@/components/global/EditableTable";
import { deferedActivesSlice } from "@/store/balance.store";

// No fixed rows - Activo Diferido (Seguros / Pago de Seguros) has no source
// field anywhere in InputNovus (confirmed - not even the reference Template
// Financiero has real data for it, always $0). Rather than show 2 rows that
// are always zero, leave it empty and let the user add their own rows for
// whatever their business actually needs to defer/amortize.
export const DEFERED_ACTIVES_ROWS = [];

// No own store/Provider - relies on the shared editsStore ProjectDashboard
// mounts, so this table's overrides/custom rows are readable from anywhere
// else in the tab, e.g. Shareholder's Equity recomputing Total Assets live.
function DeferedActives({ deferedActives, currency }) {
  deferedActives = { ...deferedActives };
  delete deferedActives["total"];
  deferedActives = flipObject(deferedActives);

  const columns = Object.keys(deferedActives).map((year) => ({
    key: year,
    label: year,
  }));
  const getValue = (rowKey, year) => deferedActives[year]?.[rowKey] ?? 0;

  return (
    <EditableTable
      title="Defered Actives"
      slice={deferedActivesSlice}
      columns={columns}
      rows={DEFERED_ACTIVES_ROWS}
      getValue={getValue}
      totalLabel="Total Defered Actives"
      currency={currency}
    />
  );
}

function flipObject(obj) {
  const result = {};

  Object.entries(obj).forEach(([key, values]) => {
    Object.entries(values).forEach(([innerKey, value]) => {
      if (!result[innerKey]) {
        result[innerKey] = {};
      }

      result[innerKey][key] = value;
    });
  });

  return result;
}

export default DeferedActives;
