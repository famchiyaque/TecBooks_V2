-- V1 folder of businesses: program name + one game per uploaded Excel.
-- Replaces the old 0007 cbm_json tables. Bootstraps schema plumbing only
-- (schedule row, premises.periods) — not demo business data.

ALTER TABLE "premises" ADD COLUMN "periods" INTEGER NOT NULL DEFAULT 60;

ALTER TABLE "game_team_employees" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_schedules_name" ON "schedules" ("name");

INSERT OR IGNORE INTO "schedules" (
  "name",
  "description",
  "hours_per_week",
  "days_per_week",
  "hours_per_day",
  "start_time",
  "end_time"
) VALUES (
  'full-time',
  'Full-time schedule',
  40,
  5,
  8,
  '09:00',
  '18:00'
);

CREATE TABLE IF NOT EXISTS "feasibility_programs" (
  "id" INTEGER PRIMARY KEY,
  "name" TEXT NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL,
  FOREIGN KEY ("created_by") REFERENCES "users"("id")
);

DROP TABLE IF EXISTS "feasibility_projects";

CREATE TABLE "feasibility_projects" (
  "id" INTEGER PRIMARY KEY,
  "program_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "game_id" INTEGER NOT NULL,
  FOREIGN KEY ("program_id") REFERENCES "feasibility_programs"("id"),
  FOREIGN KEY ("game_id") REFERENCES "games"("id")
);

CREATE INDEX IF NOT EXISTS "idx_feasibility_programs_created_by"
  ON "feasibility_programs" ("created_by");
CREATE INDEX "idx_feasibility_projects_program_id"
  ON "feasibility_projects" ("program_id");
CREATE UNIQUE INDEX "idx_feasibility_projects_game_id"
  ON "feasibility_projects" ("game_id");
