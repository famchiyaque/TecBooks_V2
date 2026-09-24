-- =====================================================================
-- Novus Runtime v8 -- delta sobre v4: agrega student_programs.
-- (el resto de v8 es identico a v4 a nivel funcional: VARCHAR(600) y TEXT
-- son el mismo tipo en SQLite/D1, no se re-crean tablas sin cambios reales.
-- "schedules" y su FK en employees ya existen desde 0002, v8 los habia
-- quitado por error y se mantienen.)
-- =====================================================================

CREATE TABLE "student_programs" (
  "id" INTEGER PRIMARY KEY,
  "project_program_id" INTEGER NOT NULL,
  "game_team_student_id" INTEGER,
  "solo_session_id" INTEGER,
  "assigned_at" TEXT NOT NULL,
  FOREIGN KEY ("project_program_id") REFERENCES "project_programs"("id"),
  FOREIGN KEY ("game_team_student_id") REFERENCES "game_team_students"("id"),
  FOREIGN KEY ("solo_session_id") REFERENCES "solo_sessions"("id"),
  CHECK (
    (game_team_student_id IS NOT NULL AND solo_session_id IS NULL)
    OR (game_team_student_id IS NULL AND solo_session_id IS NOT NULL)
  )
);

CREATE INDEX "idx_student_programs_project_program_id_game_team_student_id" ON "student_programs" ("project_program_id", "game_team_student_id");
CREATE INDEX "idx_student_programs_project_program_id_solo_session_id" ON "student_programs" ("project_program_id", "solo_session_id");
