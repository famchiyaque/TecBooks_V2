-- Persist the custom rows a user adds (EditableTable / addCustomRow) to the
-- editable financial tables. One row per (row_id, year) so a custom row's
-- per-year values round-trip through D1, keyed by game_id (game IS the
-- project via feasibility_projects.game_id) + table_key (which UI table).
-- value stays NULL until the user fills that cell.

CREATE TABLE "row_table" (
  "id" INTEGER PRIMARY KEY,
  "game_id" INTEGER NOT NULL,
  "table_key" TEXT NOT NULL,
  "row_id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "value" REAL,
  FOREIGN KEY ("game_id") REFERENCES "games"("id")
);

CREATE INDEX "idx_row_table_game_id" ON "row_table" ("game_id");
CREATE UNIQUE INDEX "idx_row_table_game_table_row_year"
  ON "row_table" ("game_id", "table_key", "row_id", "year");