-- Scalar demand growth rate from Premisas B33 (e.g. 0.07 = 7%).
-- Used to project purchase orders after year 0; not national inflation.
ALTER TABLE premises ADD COLUMN demand_growth REAL;
