-- =====================================================================
-- Novus Administration -- esquema generado desde novus_administration.dbml
-- (adaptado de Mongo-style a relacional: los arrays "participant_ids" y
-- "student_ids" del .dbml original se modelan como tablas de relacion
-- normalizadas -- lobby_participants y game_team_members -- en vez de
-- columnas JSON, para tener integridad referencial real en SQLite/D1.)
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ============ RBAC ============

CREATE TABLE "roles" (
  "id" INTEGER PRIMARY KEY,
  "role" TEXT NOT NULL UNIQUE
);

CREATE TABLE "permissions" (
  "id" INTEGER PRIMARY KEY,
  "permission" TEXT NOT NULL UNIQUE
);

CREATE TABLE "role_permission" (
  "role_id" INTEGER NOT NULL,
  "permission_id" INTEGER NOT NULL,
  PRIMARY KEY ("role_id", "permission_id"),
  FOREIGN KEY ("role_id") REFERENCES "roles"("id"),
  FOREIGN KEY ("permission_id") REFERENCES "permissions"("id")
);

-- ============ ORGANIZATION ============

CREATE TABLE "schools" (
  "id" INTEGER PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "domain" TEXT UNIQUE,
  "country" TEXT,
  "city" TEXT,
  "contact_email" TEXT,
  "active" INTEGER NOT NULL DEFAULT 1,
  "created_at" TEXT
);

CREATE TABLE "users" (
  "id" INTEGER PRIMARY KEY,
  "school_id" INTEGER NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "role_id" INTEGER NOT NULL,
  "hashed_password" TEXT,
  "created_at" TEXT,
  FOREIGN KEY ("school_id") REFERENCES "schools"("id"),
  FOREIGN KEY ("role_id") REFERENCES "roles"("id")
);

-- ============ ACADEMIC (organizational only) ============

CREATE TABLE "classes" (
  "id" INTEGER PRIMARY KEY,
  "school_id" INTEGER NOT NULL,
  "teacher_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TEXT,
  FOREIGN KEY ("school_id") REFERENCES "schools"("id"),
  FOREIGN KEY ("teacher_id") REFERENCES "users"("id")
);

-- ============ GAMES (one-off sessions) ============

CREATE TABLE "games" (
  "id" INTEGER PRIMARY KEY,
  "class_id" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "start_date" TEXT,
  "end_date" TEXT,
  "created_at" TEXT,
  "updated_at" TEXT,
  FOREIGN KEY ("class_id") REFERENCES "classes"("id"),
  FOREIGN KEY ("created_by") REFERENCES "users"("id")
);

-- ============ LOBBY ============

CREATE TABLE "lobbies" (
  "game_id" INTEGER PRIMARY KEY,
  "join_code" TEXT NOT NULL UNIQUE,
  "opened_at" TEXT,
  "closed_at" TEXT,
  FOREIGN KEY ("game_id") REFERENCES "games"("id")
);

-- Reemplaza lobbies.participant_ids (json array en el .dbml original).
-- Usuario se quita de aqui cuando se asigna a un game_team (game_team_members).
CREATE TABLE "lobby_participants" (
  "game_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  PRIMARY KEY ("game_id", "user_id"),
  FOREIGN KEY ("game_id") REFERENCES "lobbies"("game_id"),
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Reemplaza game_teams.student_ids (json array en el .dbml original).
-- game_teams ya existe (0002_novus_runtime_v4.sql); esta tabla solo agrega
-- la relacion de membresia sin tocar esa tabla.
CREATE TABLE "game_team_members" (
  "game_team_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  PRIMARY KEY ("game_team_id", "user_id"),
  FOREIGN KEY ("game_team_id") REFERENCES "game_teams"("id"),
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- ============ GAME INPUTS (config anchor) ============

CREATE TABLE "game_inputs" (
  "game_id" INTEGER PRIMARY KEY,
  "updated_at" TEXT,
  FOREIGN KEY ("game_id") REFERENCES "games"("id")
);
