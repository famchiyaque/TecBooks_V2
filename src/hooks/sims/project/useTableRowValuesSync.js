import { useEffect, useRef } from "react";
import {
  getTableRowValuesRequest,
  replaceTableRowValuesRequest,
} from "@/sims/project-feasibility/api/table-row-values.api";
import { Logger } from "@/sims/project-feasibility/utils/logger.js";
import {
  costTableEditsSlice,
  operatingExpenseEditsSlice,
  financialResultEditsSlice,
  taxesEditsSlice,
  cashFlowEditsSlice,
  outflowEditsSlice,
} from "@/store/costTable.store";
import {
  currentActivesSlice,
  deferedActivesSlice,
  currentPassiveSlice,
  longTermPassiveSlice,
  equitySlice,
} from "@/store/balance.store";

const logger = new Logger("TableRowValuesSync");
const SAVE_DEBOUNCE_MS = 800;

// Same 11 slices ProjectDashboard's editsStore combines - kept here (not a
// hook param) so the slice list can't drift from the reducer map, and so
// callers don't have to pass an array literal that'd change identity (and
// re-run this effect) on every render.
const SLICES = [
  costTableEditsSlice,
  operatingExpenseEditsSlice,
  financialResultEditsSlice,
  taxesEditsSlice,
  cashFlowEditsSlice,
  outflowEditsSlice,
  currentActivesSlice,
  deferedActivesSlice,
  currentPassiveSlice,
  longTermPassiveSlice,
  equitySlice,
];

/**
 * Hydrates every editable table from the server on mount (GET), then keeps
 * the server in sync with further edits: debounced PUT per slice, only for
 * slices whose serialized state actually changed since the last save.
 *
 * Mount once per project, against the same store all 11 slices share
 * (ProjectDashboard's editsStore) - not per-table, so an edit in one slice
 * can't trigger a save loop in another.
 */
export default function useTableRowValuesSync(store, gameId) {
  const lastSavedRef = useRef(new Map());
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!store || !Number.isInteger(gameId) || gameId < 1) return undefined;

    let cancelled = false;
    hydratedRef.current = false;
    lastSavedRef.current = new Map();
    const timers = new Map();

    async function hydrate() {
      await Promise.all(
        SLICES.map(async (slice) => {
          try {
            const rows = await getTableRowValuesRequest(gameId, slice.type);
            if (cancelled) return;
            const state = slice.fromApiRows(rows);
            store.dispatch(slice.actions.hydrate(state));
            lastSavedRef.current.set(slice.type, JSON.stringify(rows));
          } catch (error) {
            logger.error(`failed to hydrate ${slice.type}`, error);
          }
        }),
      );
      if (!cancelled) hydratedRef.current = true;
    }
    hydrate();

    const unsubscribe = store.subscribe(() => {
      if (!hydratedRef.current) return;
      const state = store.getState();

      for (const slice of SLICES) {
        const sliceState = state[slice.name];
        if (!sliceState) continue;

        const rows = slice.toApiRows(sliceState);
        const serialized = JSON.stringify(rows);
        if (serialized === lastSavedRef.current.get(slice.type)) continue;

        clearTimeout(timers.get(slice.type));
        const timer = setTimeout(async () => {
          try {
            await replaceTableRowValuesRequest(gameId, slice.type, rows);
            lastSavedRef.current.set(slice.type, serialized);
          } catch (error) {
            logger.error(`failed to save ${slice.type}`, error);
          }
        }, SAVE_DEBOUNCE_MS);
        timers.set(slice.type, timer);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
      for (const timer of timers.values()) clearTimeout(timer);
    };
  }, [store, gameId]);
}
