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

const DEFAULT_CURRENT_PASSIVE_LABEL = "Documentos por pagar corto plazo";
const DEFAULT_YEAR_ZERO_VALUE = 450000;
const DEFAULT_LATER_YEAR_VALUE = 45000;
// Stable id so the seed below, the hydrate fallback, and any later reconcile
// all refer to the SAME row - a nanoid here would re-add a duplicate every
// time the two paths disagreed.
const DEFAULT_CURRENT_PASSIVE_ROW_ID = "default-doc-por-pagar-cp";

/**
 * The default Current Passives row, in the SERVER's row shape (what
 * useTableRowsSync's `fallbackRows` expects, and what EditableTableSlice's
 * hydrate turns into `id`).
 *
 * Years come from the caller, not HORIZON_YEARS: `cbm.timeline.years` is
 * derived per project from the game's start/end date (see
 * worker/src/mappers/game-to-cbm.mapper.js yearsFromGame), so a project whose
 * horizon isn't 2025-2035 needs its own keys.
 */
function buildDefaultCurrentPassiveRow(years) {
  return {
    rowId: DEFAULT_CURRENT_PASSIVE_ROW_ID,
    label: DEFAULT_CURRENT_PASSIVE_LABEL,
    values: Object.fromEntries(
      years.map((year, index) => [
        year,
        index === 0 ? DEFAULT_YEAR_ZERO_VALUE : DEFAULT_LATER_YEAR_VALUE,
      ]),
    ),
  };
}

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
 * BUG FIX (2): even with the seed owned here, the first row still came up
 * blank on a cold load and only filled in after a page reload, because the
 * seed ran in a PASSIVE effect - one frame after a render that had already
 * divided by zero - and the server round-trip was still in flight. Now the
 * default row exists in the store's initial state (see the layout effect
 * below plus useTableRowsSync's `fallbackRows`), so the very first render
 * already divides by a real number and there is nothing left to wait for.
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
  const defaultCurrentPassiveRow = React.useMemo(
    () => (years.length > 0 ? buildDefaultCurrentPassiveRow(years) : null),
    [years],
  );
  const defaultCurrentPassiveRows = React.useMemo(
    () => (defaultCurrentPassiveRow ? [defaultCurrentPassiveRow] : []),
    [defaultCurrentPassiveRow],
  );
  useTableRowsSync(gameId, currentPassiveSlice, "currentPassives", {
    fallbackRows: defaultCurrentPassiveRows,
  });

  const currentActivesOverrides = useSelector(
    currentActivesSlice.selectOverrides,
  );
  const currentActivesCustomRows = useSelector(
    currentActivesSlice.selectCustomRows,
  );
  const deferedActivesOverrides = useSelector(
    deferedActivesSlice.selectOverrides,
  );
  const deferedActivesCustomRows = useSelector(
    deferedActivesSlice.selectCustomRows,
  );
  const currentPassivesOverrides = useSelector(
    currentPassiveSlice.selectOverrides,
  );
  const currentPassivesCustomRows = useSelector(
    currentPassiveSlice.selectCustomRows,
  );
  const longTermPassivesOverrides = useSelector(
    longTermPassiveSlice.selectOverrides,
  );
  const longTermPassivesCustomRows = useSelector(
    longTermPassiveSlice.selectCustomRows,
  );

  // Put the default "Documentos por pagar corto plazo" row in the store on
  // the FIRST commit, before the browser paints. useLayoutEffect (not
  // useEffect) is the whole point: a dispatch from here re-renders
  // synchronously before paint, so the Ratios tab never shows a frame of
  // "—" where it divides by currentPassivesTotal.
  //
  // The server's answer still wins: useTableRowsSync's hydrate replaces
  // customRows wholesale once row_table responds, and only falls back to this
  // same row when the server has nothing saved (see its `fallbackRows`).
  // Seeding twice is therefore harmless - both paths build the identical row
  // with the identical id - which is why the id has to be stable.
  //
  // The ref keeps this to one dispatch per mount, so the user can still
  // delete the row (and have it stay deleted) for the rest of the session.
  const seededDefaultRow = React.useRef(false);
  React.useLayoutEffect(() => {
    if (seededDefaultRow.current) return;
    if (!defaultCurrentPassiveRow) return;

    const alreadyExists = currentPassivesCustomRows.some(
      (row) => row.id === DEFAULT_CURRENT_PASSIVE_ROW_ID,
    );

    if (alreadyExists) return;

    seededDefaultRow.current = true;

    dispatch(
      currentPassiveSlice.actions.addCustomRow({
        id: DEFAULT_CURRENT_PASSIVE_ROW_ID,
        label: defaultCurrentPassiveRow.label,
        values: defaultCurrentPassiveRow.values,
      }),
    );
  }, [defaultCurrentPassiveRow, currentPassivesCustomRows, dispatch]);

  const getCurrentActivesValue = (rowKey, year) =>
    actives.currentActives[rowKey]?.[year] ?? 0;
  const getDeferedActivesValue = (rowKey, year) =>
    actives.deferedActives[rowKey]?.[year] ?? 0;
  const getCurrentPassivesValue = (rowKey, year) =>
    passivesData.currentPassives[year]?.[rowKey] ?? 0;
  const getLongTermPassivesValue = (rowKey, year) =>
    passivesData.longTermPassives[year]?.[rowKey] ?? 0;

  const byYear = {};
  years.forEach((year, idx) => {
    const currentActivesTotal = currentActivesSlice.effectiveTotal(
      {
        overrides: currentActivesOverrides,
        customRows: currentActivesCustomRows,
      },
      COST_ROWS,
      getCurrentActivesValue,
      year,
    );
    const deferedActivesTotal = deferedActivesSlice.effectiveTotal(
      {
        overrides: deferedActivesOverrides,
        customRows: deferedActivesCustomRows,
      },
      DEFERED_ACTIVES_ROWS,
      getDeferedActivesValue,
      year,
    );
    const fixedAssetsNetValue =
      actives.fixedAssets?.find((item) => String(item.year) === String(year))
        ?.netValue || 0;
    const totalActives =
      currentActivesTotal + deferedActivesTotal + fixedAssetsNetValue;

    const currentPassivesTotal = currentPassiveSlice.effectiveTotal(
      {
        overrides: currentPassivesOverrides,
        customRows: currentPassivesCustomRows,
      },
      CURRENT_PASSIVES,
      getCurrentPassivesValue,
      year,
    );
    const longTermPassivesTotal = longTermPassiveSlice.effectiveTotal(
      {
        overrides: longTermPassivesOverrides,
        customRows: longTermPassivesCustomRows,
      },
      LONG_TERM_PASSIVES,
      getLongTermPassivesValue,
      year,
    );
    const totalPassives = currentPassivesTotal + longTermPassivesTotal;

    // "Inventario" (Balance row 6) for Prueba del Ácido / Acid Test - single
    // cell read (override-aware), not a table total. Field is named
    // `inventary` in computeCurrentActives.js/COST_ROWS (mislabeled "Accounts
    // Receivable" in the UI - a separate, pre-existing naming bug).
    const inventoryOverrideKey = `inventary:${year}`;
    const inventory =
      inventoryOverrideKey in currentActivesOverrides
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
