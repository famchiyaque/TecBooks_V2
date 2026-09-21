-- Persistence for the "editable table" pattern (EditableTableSlice on the
-- client: per-cell overrides on fixed rows + user-added custom rows).
-- Session-only Redux was never meant to be the source of truth for these
-- (see .agents/technical-debt.md - "do not revive Redux as the CBM
-- database") - this table is that missing persistence layer.
--
-- Grain is one cell: (game_id, type, row_key, year). A financial row with
-- values across N years is N rows here, all sharing row_key - not one row
-- holding every year. `type` says which of the 11 editable tables this cell
-- belongs to (cost_table, operating_expenses, financial_result, taxes,
-- cash_inflows, cash_outflows, current_actives, defered_actives,
-- current_passives, long_term_passives, equity). `row_key` is a known field
-- key (e.g. 'rawMaterial') for an override on a fixed row, or a generated id
-- for a custom row the user added - `is_custom` tells them apart, `label`
-- is only set for the latter.
CREATE TABLE "table_row_values" (
  "id" INTEGER PRIMARY KEY,
  "game_id" INTEGER NOT NULL,
  "type" VARCHAR(50) NOT NULL,
  "row_key" VARCHAR(100) NOT NULL,
  "label" VARCHAR(600),
  "is_custom" INTEGER NOT NULL DEFAULT 0,
  "year" INTEGER NOT NULL,
  "value" REAL NOT NULL,
  FOREIGN KEY ("game_id") REFERENCES "games"("id")
);

CREATE UNIQUE INDEX "idx_table_row_values_game_type_row_year"
  ON "table_row_values" ("game_id", "type", "row_key", "year");

-- Fetch pattern is always "all cells for this project's table":
-- WHERE game_id = ? AND type = ?
CREATE INDEX "idx_table_row_values_game_type"
  ON "table_row_values" ("game_id", "type");
