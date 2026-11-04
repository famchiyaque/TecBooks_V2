CREATE TABLE "game_rooms" (
  "game_id" INTEGER PRIMARY KEY,
  "code" VARCHAR(600) NOT NULL UNIQUE,
  "created_by" INTEGER NOT NULL,
  "created_at" VARCHAR(600) NOT NULL,
  "closed_at" VARCHAR(600)
);