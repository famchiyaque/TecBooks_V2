import React from "react";
import { useDispatch, useSelector } from "react-redux";
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
import useTableRowsSync from "@/hooks/sims/project/useTableRowsSync.js";
import useTableRowsQuery from "@/hooks/sims/project/useTableRows.js";

const DEFAULT_CURRENT_PASSIVE_LABEL = "Documentos por pagar corto plazo";
const DEFAULT_YEAR_ZERO_VALUE = 450000;
const DEFAULT_LATER_YEAR_VALUE = 45000;

/**
 * Per-year effective (override + custom-row aware) Balance Sheet totals,
 * shared by Shareholder's Equity, Total Actives and the Ratios table so all
 * three read the same live numbers instead of each re-deriving them - same
 * "read the slice, recompute live" pattern ProfitSummaryTable.jsx uses for
 * Cost Table/Opex/Taxes, just factored out since multiple consumers need it.
 *
 * BUG FIX: Current Ratio/Acid Test (Ratios tab) went blank ("-") until the
 * user opened the Balance tab at least once per session - Current Passives
 * has no fixed rows (see Passive.jsx), only a default custom row seeded by
 * an effect that used to live in Passive.jsx itself, so currentPassivesTotal
 * stayed 0 (division by 0) for any consumer of this hook that mounted before
 * Passive.jsx did. Owning that hydrate+seed here instead means it fires for
 * whichever tab reads balance totals first - Ratios, Equity or Balance.
 *
 * @param {Object} cbm
 * @param {number} gameId
 * @returns {Object} keyed by year: { currentActivesTotal, deferedActivesTotal,
 *   totalActives, currentPassivesTotal, longTermPassivesTotal, totalPassives,
 *   inventory, netSales, netIncome }
 */
function useEffectiveBalanceTotals(cbm, gameId) {
  const years = cbm.timeline.years;

  const actives = computeActives(cbm);
  const passivesData = computePassives(cbm);
  const { costOfSalesByYear } = buildCostOfSales(cbm);

  const dispatch = useDispatch();
  useTableRowsSync(gameId, currentPassiveSlice, "currentPassives");
  const { data: tableRowsData } = useTableRowsQuery(gameId);

  const currentActivesOverrides = useSelector(currentActivesSlice.selectOverrides);
  const currentActivesCustomRows = useSelector(currentActivesSlice.selectCustomRows);
  const deferedActivesOverrides = useSelector(deferedActivesSlice.selectOverrides);
  const deferedActivesCustomRows = useSelector(deferedActivesSlice.selectCustomRows);
  const currentPassivesOverrides = useSelector(currentPassiveSlice.selectOverrides);
  const currentPassivesCustomRows = useSelector(currentPassiveSlice.selectCustomRows);
  const longTermPassivesOverrides = useSelector(longTermPassiveSlice.selectOverrides);
  const longTermPassivesCustomRows = useSelector(longTermPassiveSlice.selectCustomRows);

  // Seed the default "Documentos por pagar corto plazo" row exactly once,
  // and only once we KNOW from the server that this game truly has none
  // saved yet for "currentPassives" (row_table) - useTableRowsSync's own
  // hydrate effect (registered above, so it runs first) already replaced
  // customRows with whatever the server has by the time this checks.
  const seededDefaultRow = React.useRef(false);
  React.useEffect(() => {
    if (seededDefaultRow.current || !tableRowsData) return;
    seededDefaultRow.current = true;
    const hasSavedRows = (tableRowsData.currentPassives ?? []).length > 0;
    if (hasSavedRows || currentPassivesCustomRows.length > 0) return;
    if (years.length === 0) return;
    const values = {};
    years.forEach((year, index) => {
      values[year] = index === 0 ? DEFAULT_YEAR_ZERO_VALUE : DEFAULT_LATER_YEAR_VALUE;
    });
    dispatch(currentPassiveSlice.actions.addCustomRow({ label: DEFAULT_CURRENT_PASSIVE_LABEL, values }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRowsData]);

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
