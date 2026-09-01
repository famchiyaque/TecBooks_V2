DROP TABLE "expenses";

CREATE TABLE IF NOT EXISTS "expenses" (
    "id" INTEGER PRIMARY KEY,
    "game_id" INTEGER NOT NULL,
    "category" VARCHAR(600) NOT NULL,
    "subcategory" VARCHAR(600) NOT NULL,
    "name" VARCHAR(600) NOT NULL,
    "description" VARCHAR(600),
    "default_cost" REAL,
    "expense_type" VARCHAR(600) DEFAULT 'fixed',
    "notes" VARCHAR(600),
    FOREIGN KEY ("game_id") REFERENCES "games"("game_id")
);