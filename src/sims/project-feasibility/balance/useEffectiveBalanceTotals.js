import { useSelector } from "react-redux";
import computeActives from "./computeActives.js";
import computePassives from "./computePassives.js";
import { buildCostOfSales } from "@/sims/project-feasibility/costTable/buildCostOfSales.js";
import {
  currentActivesSlice,
  deferedActivesSlice,
  currentPassiveSlice,
  longTermPassiveSlice,
} from "@/store/balance.store";
import { COST_ROWS } from "@/components/sims/program/balance/CurrentActives.jsx";
import { DEFERED_ACTIVES_ROWS } from "@/components/sims/program/balance/DeferedActives.jsx";
import {
  CURRENT_PASSIVES,
  LONG_TERM_PASSIVES,
} from "@/components/sims/program/balance/Passive.jsx";

/**
 * Per-year effective (override + custom-row aware) Balance Sheet totals,
 * shared by Shareholder's Equity and the Ratios table so both read the same
 * live numbers instead of each re-deriving them - same "read the slice,
 * recompute live" pattern ProfitSummaryTable.jsx uses for Cost Table/Opex/
 * Taxes, just factored out since two consumers now need it.
 *
 * @param {Object} cbm
 * @returns {Object} keyed by year: { currentActivesTotal, deferedActivesTotal,
 *   totalActives, currentPassivesTotal, longTermPassivesTotal, totalPassives,
 *   inventory, netSales, netIncome }
 */
function useEffectiveBalanceTotals(cbm) {
  const years = cbm.timeline.years;

  const actives = computeActives(cbm);
  const passivesData = computePassives(cbm);
  const { costOfSalesByYear } = buildCostOfSales(cbm);

  const currentActivesOverrides = useSelector(currentActivesSlice.selectOverrides);
  const currentActivesCustomRows = useSelector(currentActivesSlice.selectCustomRows);
  const deferedActivesOverrides = useSelector(deferedActivesSlice.selectOverrides);
  const deferedActivesCustomRows = useSelector(deferedActivesSlice.selectCustomRows);
  const currentPassivesOverrides = useSelector(currentPassiveSlice.selectOverrides);
  const currentPassivesCustomRows = useSelector(currentPassiveSlice.selectCustomRows);
  const longTermPassivesOverrides = useSelector(longTermPassiveSlice.selectOverrides);
  const longTermPassivesCustomRows = useSelector(longTermPassiveSlice.selectCustomRows);

  const getCurrentActivesValue = (rowKey, year) => actives.currentActives[rowKey]?.[year] ?? 0;
  const getDeferedActivesValue = (rowKey, year) => actives.deferedActives[rowKey]?.[year] ?? 0;
  const getCurrentPassivesValue = (rowKey, year) => passivesData.currentPassives[year]?.[rowKey] ?? 0;
  const getLongTermPassivesValue = (rowKey, year) => passivesData.longTermPassives[year]?.[rowKey] ?? 0;

  const byYear = {};
  years.forEach((year, idx) => {
    const currentActivesTotal = currentActivesSlice.effectiveTotal(
      { overrides: currentActivesOverrides, customRows: currentActivesCustomRows },
      COST_ROWS, getCurrentActivesValue, year,
    );
    const deferedActivesTotal = deferedActivesSlice.effectiveTotal(
      { overrides: deferedActivesOverrides, customRows: deferedActivesCustomRows },
      DEFERED_ACTIVES_ROWS, getDeferedActivesValue, year,
    );
    const fixedAssetsNetValue = actives.fixedAssets?.find(
      (item) => String(item.year) === String(year),
    )?.netValue || 0;
    const totalActives = currentActivesTotal + deferedActivesTotal + fixedAssetsNetValue;

    const currentPassivesTotal = currentPassiveSlice.effectiveTotal(
      { overrides: currentPassivesOverrides, customRows: currentPassivesCustomRows },
      CURRENT_PASSIVES, getCurrentPassivesValue, year,
    );
    const longTermPassivesTotal = longTermPassiveSlice.effectiveTotal(
      { overrides: longTermPassivesOverrides, customRows: longTermPassivesCustomRows },
      LONG_TERM_PASSIVES, getLongTermPassivesValue, year,
    );
    const totalPassives = currentPassivesTotal + longTermPassivesTotal;

    // "Inventario" (Balance row 6) for Prueba del Ácido / Acid Test - single
    // cell read (override-aware), not a table total. Field is named
    // `inventary` in computeCurrentActives.js/COST_ROWS (mislabeled "Accounts
    // Receivable" in the UI - a separate, pre-existing naming bug).
    const inventoryOverrideKey = `inventary:${year}`;
    const inventory = inventoryOverrideKey in currentActivesOverrides
      ? currentActivesOverrides[inventoryOverrideKey]
      : getCurrentActivesValue("inventary", year);

    byYear[year] = {
      currentActivesTotal,
      deferedActivesTotal,
      totalActives,
      currentPassivesTotal,
      longTermPassivesTotal,
      totalPassives,
      inventory,
      netSales: costOfSalesByYear[idx].netSales,
      netIncome: costOfSalesByYear[idx].netIncome,
    };
  });

  return byYear;
}

export default useEffectiveBalanceTotals;
