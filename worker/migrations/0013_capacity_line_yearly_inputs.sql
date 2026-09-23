-- production_line_capacity_yearly already existed (migration 0002) but was
-- dead code - only annual_capacity (the derived result), never the raw
-- Capacidad inputs (Quality Yield, Shifts, etc.), and nothing ever
-- inserted/selected from it. Those inputs genuinely vary year to year in
-- InputNovus's own Capacidad sheet - without a place to persist them, a
-- save/reload round-trip collapsed them to one flat scalar (see the
-- `capacity` table's own columns, no year dimension), silently losing all
-- per-year variation on every project save.
ALTER TABLE production_line_capacity_yearly ADD COLUMN quality_yield REAL;
ALTER TABLE production_line_capacity_yearly ADD COLUMN seconds_x_unit REAL;
ALTER TABLE production_line_capacity_yearly ADD COLUMN hours_shift REAL;
ALTER TABLE production_line_capacity_yearly ADD COLUMN shifts INTEGER;
ALTER TABLE production_line_capacity_yearly ADD COLUMN production_lines_count INTEGER;
ALTER TABLE production_line_capacity_yearly ADD COLUMN week_working_days INTEGER;
ALTER TABLE production_line_capacity_yearly ADD COLUMN months_working_weeks INTEGER;
ALTER TABLE production_line_capacity_yearly ADD COLUMN year_working_months INTEGER;
