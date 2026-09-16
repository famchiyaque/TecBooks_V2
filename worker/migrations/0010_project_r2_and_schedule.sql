-- Original Excel lives in R2; the key is stored on the project row.
-- schedules.name must be unique so employees.schedule can FK to 'full-time'.
ALTER TABLE "feasibility_projects" ADD COLUMN "r2_key" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_schedules_name" ON "schedules" ("name");
