CREATE TABLE "game_rooms" (
  "game_id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "code" VARCHAR(600) NOT NULL UNIQUE,
  "game_name" VARCHAR(600) NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" VARCHAR(600) NOT NULL,
  "n_teams" INTEGER DEFAULT(2),
  "time_round" INTEGER DEFAULT(60),
  "closed_at" VARCHAR(600)
);

CREATE TABLE "projects_temp" (
  "project_id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "project" VARCHAR(600)
);

CREATE TABLE "game_project" (
  "game_id" INTEGER NOT NULL,
  "project_id" INTEGER NOT NULL,
  PRIMARY KEY ("game_id", "project_id"),
  FOREIGN KEY("game_id") REFERENCES "game_rooms"("game_id"),
  FOREIGN KEY("project_id") REFERENCES "projects_temp"("project_id")
);

INSERT INTO "projects_temp" ("project") VALUES
  ('Dron'),
  ('F1'),
  ('Dron Militar');
