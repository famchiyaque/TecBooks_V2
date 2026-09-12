-- premises_deprecations/premises_deprecations_yearly had one fixed column per
-- asset category (building/transport/compute/machinery) - a category
-- Inversion invents (see readInversion's structural detection) has nowhere
-- to store its rate. Normalize to 1-to-many, same pattern as assets/
-- asset_cost_yearly: one row per (game, category), one row per (category, year).

ALTER TABLE premises_deprecations RENAME TO premises_deprecations_legacy;
ALTER TABLE premises_deprecations_yearly RENAME TO premises_deprecations_yearly_legacy;

CREATE TABLE "premises_deprecations" (
  "id" INTEGER PRIMARY KEY,
  "game_id" INTEGER NOT NULL,
  "category" VARCHAR(600) NOT NULL,
  "rate" REAL,
  FOREIGN KEY ("game_id") REFERENCES "premises"("game_id")
);

CREATE TABLE "premises_deprecations_yearly" (
  "id" INTEGER PRIMARY KEY,
  "deprecation_id" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "rate" REAL,
  FOREIGN KEY ("deprecation_id") REFERENCES "premises_deprecations"("id")
);

INSERT INTO premises_deprecations (game_id, category, rate)
  SELECT game_id, 'building', building FROM premises_deprecations_legacy WHERE building IS NOT NULL
  UNION ALL
  SELECT game_id, 'transport', transport FROM premises_deprecations_legacy WHERE transport IS NOT NULL
  UNION ALL
  SELECT game_id, 'compute', compute FROM premises_deprecations_legacy WHERE compute IS NOT NULL
  UNION ALL
  SELECT game_id, 'machinery', machinery FROM premises_deprecations_legacy WHERE machinery IS NOT NULL;

INSERT INTO premises_deprecations_yearly (deprecation_id, year, rate)
  SELECT d.id, y.year, y.building
    FROM premises_deprecations_yearly_legacy y
    JOIN premises_deprecations d ON d.game_id = y.game_id AND d.category = 'building'
    WHERE y.building IS NOT NULL
  UNION ALL
  SELECT d.id, y.year, y.transport
    FROM premises_deprecations_yearly_legacy y
    JOIN premises_deprecations d ON d.game_id = y.game_id AND d.category = 'transport'
    WHERE y.transport IS NOT NULL
  UNION ALL
  SELECT d.id, y.year, y.compute
    FROM premises_deprecations_yearly_legacy y
    JOIN premises_deprecations d ON d.game_id = y.game_id AND d.category = 'compute'
    WHERE y.compute IS NOT NULL
  UNION ALL
  SELECT d.id, y.year, y.machinery
    FROM premises_deprecations_yearly_legacy y
    JOIN premises_deprecations d ON d.game_id = y.game_id AND d.category = 'machinery'
    WHERE y.machinery IS NOT NULL;

DROP TABLE premises_deprecations_legacy;
DROP TABLE premises_deprecations_yearly_legacy;
