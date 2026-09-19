-- 0007_add_game_id_to_expenses.sql declared FOREIGN KEY ("game_id") REFERENCES
-- "games"("game_id"), but games' primary key column is "id", not "game_id"
-- (see 0004_administration.sql). That FK never pointed at a real column.

DROP TABLE "expenses";

CREATE TABLE "expenses" (
    "id" INTEGER PRIMARY KEY,
    "game_id" INTEGER NOT NULL,
    "category" VARCHAR(600) NOT NULL,
    "subcategory" VARCHAR(600) NOT NULL,
    "name" VARCHAR(600) NOT NULL,
    "description" VARCHAR(600),
    "default_cost" REAL,
    "expense_type" VARCHAR(600) DEFAULT 'fixed',
    "notes" VARCHAR(600),
    FOREIGN KEY ("game_id") REFERENCES "games"("id")
);
