-- Project Feasibility sim: one program per upload, one JSON blob per project.
-- Does not reuse game `projects` (investment NOT NULL) or premises/boms catalogs.

CREATE TABLE "feasibility_programs" (
  "id" INTEGER PRIMARY KEY,
  "name" TEXT NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL,
  FOREIGN KEY ("created_by") REFERENCES "users"("id")
);

CREATE TABLE "feasibility_projects" (
  "id" INTEGER PRIMARY KEY,
  "program_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "cbm_json" TEXT NOT NULL,
  FOREIGN KEY ("program_id") REFERENCES "feasibility_programs"("id")
);

CREATE INDEX "idx_feasibility_programs_created_by" ON "feasibility_programs" ("created_by");
CREATE INDEX "idx_feasibility_projects_program_id" ON "feasibility_projects" ("program_id");
