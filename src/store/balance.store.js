import { EditableTableSlice } from "./EditableTableSlice.js";

// Shared by ProjectDashboard's editsStore (same pattern as costTable.store.js's
// slices) so an edit made in one Balance Sheet table is instantly visible to
// every other table/statement that reads it - e.g. Shareholder's Equity
// recomputing live off Current Actives/Passives overrides. Separate instances
// per table (not one shared slice) so a custom row added to one doesn't also
// get summed into another's total - same reasoning as costTable.store.js's
// per-table slices, and why Current Passives and Long term passives (which
// used to share one "passives" slice) got split into two below.
export const currentActivesSlice = new EditableTableSlice("currentActives", "current_actives");
export const deferedActivesSlice = new EditableTableSlice("deferedActives", "defered_actives");
export const currentPassiveSlice = new EditableTableSlice("currentPassives", "current_passives");
export const longTermPassiveSlice = new EditableTableSlice("longTermPassives", "long_term_passives");
export const equitySlice = new EditableTableSlice("equity", "equity");
