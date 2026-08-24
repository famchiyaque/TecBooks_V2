-- =====================================================================
-- Novus Runtime v4 -- esquema SQLite generado desde novus_runtime_v4.dbml
-- Generado automaticamente. No incluye tablas externas (games, users)
-- definidas en novus_administration.dbml.
-- =====================================================================

PRAGMA foreign_keys = ON;

CREATE TABLE "game_teams" (
  "id" INTEGER PRIMARY KEY,
  "game_id" INTEGER NOT NULL,
  "name" VARCHAR(600) NOT NULL,
  "capital" REAL NOT NULL DEFAULT 0,
  "status" VARCHAR(600) NOT NULL DEFAULT 'ready',
  "created_at" VARCHAR(600)
);

CREATE TABLE "game_team_students" (
  "id" INTEGER PRIMARY KEY,
  "game_team_id" INTEGER NOT NULL,
  "display_name" VARCHAR(600) NOT NULL,
  "invite_code" VARCHAR(600) NOT NULL UNIQUE,
  "session_token" VARCHAR(600),
  "joined_at" VARCHAR(600),
  "created_by" INTEGER NOT NULL,
  FOREIGN KEY ("game_team_id") REFERENCES "game_teams"("id")
);

CREATE TABLE "premises" (
  "game_id" INTEGER PRIMARY KEY,
  "starting_money" REAL NOT NULL,
  "exchange_rate" REAL,
  "national_leading_rate" REAL,
  "cpp" REAL,
  "cetes" REAL,
  "libor" REAL,
  "national_inflation" REAL,
  "foreign_inflation" REAL,
  "isr" REAL,
  "impac" REAL,
  "ptu" REAL,
  "area" REAL,
  "rent_cost" REAL,
  "power_capacity" REAL
);

CREATE TABLE "premises_yearly" (
  "id" INTEGER PRIMARY KEY,
  "game_id" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "exchange_rate" REAL,
  "national_leading_rate" REAL,
  "cpp" REAL,
  "cetes" REAL,
  "libor" REAL,
  "national_inflation" REAL,
  "foreign_inflation" REAL,
  "isr" REAL,
  "impac" REAL,
  "ptu" REAL,
  FOREIGN KEY ("game_id") REFERENCES "premises"("game_id")
);

CREATE TABLE "premises_percentage" (
  "game_id" INTEGER PRIMARY KEY,
  "inventary_percentage" REAL,
  "provider_percentage" REAL,
  "short_term_passive_percentage" REAL,
  "product_direct_cost_percentage" REAL,
  "product_indirect_cost" REAL,
  "sale_expenses" REAL,
  "administration_percentage" REAL,
  FOREIGN KEY ("game_id") REFERENCES "premises"("game_id")
);

CREATE TABLE "premises_percentage_yearly" (
  "id" INTEGER PRIMARY KEY,
  "game_id" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "inventary_percentage" REAL,
  "provider_percentage" REAL,
  "short_term_passive_percentage" REAL,
  "product_direct_cost_percentage" REAL,
  "product_indirect_cost" REAL,
  "sale_expenses" REAL,
  "administration_percentage" REAL,
  FOREIGN KEY ("game_id") REFERENCES "premises"("game_id")
);

CREATE TABLE "premises_deprecations" (
  "game_id" INTEGER PRIMARY KEY,
  "building" REAL,
  "transport" REAL,
  "compute" REAL,
  "machinery" REAL,
  FOREIGN KEY ("game_id") REFERENCES "premises"("game_id")
);

CREATE TABLE "premises_deprecations_yearly" (
  "id" INTEGER PRIMARY KEY,
  "game_id" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "building" REAL,
  "transport" REAL,
  "compute" REAL,
  "machinery" REAL,
  FOREIGN KEY ("game_id") REFERENCES "premises"("game_id")
);

CREATE TABLE "purchase_order_monthly_distribution" (
  "id" INTEGER PRIMARY KEY,
  "game_id" INTEGER NOT NULL,
  "month" INTEGER NOT NULL,
  "percentage" REAL NOT NULL,
  "fixed_amount" REAL,
  FOREIGN KEY ("game_id") REFERENCES "premises"("game_id")
);

CREATE TABLE "purchase_order_yearly_total" (
  "id" INTEGER PRIMARY KEY,
  "game_id" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "total" REAL NOT NULL,
  "is_projection" INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY ("game_id") REFERENCES "premises"("game_id")
);

CREATE TABLE "assets" (
  "id" INTEGER PRIMARY KEY,
  "name" VARCHAR(600) NOT NULL,
  "category" VARCHAR(600),
  "maintenance_cost" REAL,
  "production_rate" REAL
);

CREATE TABLE "asset_cost_yearly" (
  "id" INTEGER PRIMARY KEY,
  "asset_id" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "cost" REAL NOT NULL,
  FOREIGN KEY ("asset_id") REFERENCES "assets"("id")
);

CREATE TABLE "employees" (
  "id" INTEGER PRIMARY KEY,
  "name" VARCHAR(600) NOT NULL,
  "job_title" VARCHAR(600),
  "base_salary" REAL,
  "efficiency" REAL,
  "schedule" VARCHAR(600) NOT NULL DEFAULT 'full-time',
  "integrated_salary" REAL,
  FOREIGN KEY ("schedule") REFERENCES "schedules"("name")
);

CREATE TABLE "schedules" (
  "id" INTEGER PRIMARY KEY,
  "name" VARCHAR(600) NOT NULL,
  "description" VARCHAR(600),
  "hours_per_week" INTEGER NOT NULL,
  "days_per_week" INTEGER NOT NULL,
  "hours_per_day" INTEGER NOT NULL,
  "start_time" date NOT NULL,
  "end_time" date NOT NULL
);

CREATE TABLE "employee_compensation_items" (
  "id" INTEGER PRIMARY KEY,
  "employee_id" INTEGER NOT NULL,
  "item_name" VARCHAR(600) NOT NULL,
  "percentage" REAL,
  "amount" REAL NOT NULL,
  FOREIGN KEY ("employee_id") REFERENCES "employees"("id")
);

CREATE TABLE "boms" (
  "id" INTEGER PRIMARY KEY,
  "product_name" VARCHAR(600) NOT NULL,
  "sale_price" REAL
);

CREATE TABLE "required_materials" (
  "id" INTEGER PRIMARY KEY,
  "bom_id" INTEGER NOT NULL,
  "material_code" VARCHAR(600) NOT NULL,
  "material" VARCHAR(600) NOT NULL,
  "price" REAL NOT NULL,
  "amount" REAL,
  "scrap_factor" REAL,
  FOREIGN KEY ("bom_id") REFERENCES "boms"("id")
);

CREATE TABLE "order_config" (
  "id" INTEGER PRIMARY KEY,
  "product_type" VARCHAR(600),
  "initial_orders" INTEGER,
  "demand_rate" REAL
);

CREATE TABLE "expenses" (
  "id" INTEGER PRIMARY KEY,
  "category" VARCHAR(600) NOT NULL,
  "subcategory" VARCHAR(600) NOT NULL,
  "name" VARCHAR(600) NOT NULL,
  "description" VARCHAR(600),
  "default_cost" REAL,
  "expense_type" VARCHAR(600) DEFAULT 'fixed',
  "notes" VARCHAR(600)
);

CREATE TABLE "actions" (
  "id" INTEGER PRIMARY KEY,
  "code" VARCHAR(600) NOT NULL UNIQUE,
  "name" VARCHAR(600) NOT NULL,
  "description" VARCHAR(600),
  "action_type" VARCHAR(600) NOT NULL,
  "active" INTEGER DEFAULT 1
);

CREATE TABLE "game_team_employees" (
  "id" INTEGER PRIMARY KEY,
  "game_team_id" INTEGER NOT NULL,
  "employee_id" INTEGER NOT NULL,
  "employee_name" VARCHAR(600),
  "salary" REAL NOT NULL,
  "hired_at" VARCHAR(600) NOT NULL,
  "fired_at" VARCHAR(600),
  FOREIGN KEY ("game_team_id") REFERENCES "game_teams"("id"),
  FOREIGN KEY ("employee_id") REFERENCES "employees"("id")
);

CREATE TABLE "game_team_assets" (
  "id" INTEGER PRIMARY KEY,
  "game_team_id" INTEGER NOT NULL,
  "asset_id" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "unit_price" REAL NOT NULL,
  "acquired_at" VARCHAR(600) NOT NULL,
  "status" VARCHAR(600) DEFAULT 'active',
  FOREIGN KEY ("game_team_id") REFERENCES "game_teams"("id"),
  FOREIGN KEY ("asset_id") REFERENCES "assets"("id")
);

CREATE TABLE "game_team_orders" (
  "id" INTEGER PRIMARY KEY,
  "game_team_id" INTEGER NOT NULL,
  "order_config_id" INTEGER,
  "product_id" INTEGER,
  "quantity" INTEGER NOT NULL,
  "unit_price" REAL,
  "status" VARCHAR(600) NOT NULL DEFAULT 'pending',
  "placed_at" VARCHAR(600) NOT NULL,
  FOREIGN KEY ("game_team_id") REFERENCES "game_teams"("id"),
  FOREIGN KEY ("order_config_id") REFERENCES "order_config"("id"),
  FOREIGN KEY ("product_id") REFERENCES "boms"("id")
);

CREATE TABLE "team_actions" (
  "id" INTEGER PRIMARY KEY,
  "game_team_id" INTEGER NOT NULL,
  "action_id" INTEGER NOT NULL,
  "performed_by" INTEGER NOT NULL,
  "performed_at" VARCHAR(600) NOT NULL,
  FOREIGN KEY ("game_team_id") REFERENCES "game_teams"("id"),
  FOREIGN KEY ("action_id") REFERENCES "actions"("id")
);

CREATE TABLE "team_action_payload_items" (
  "id" INTEGER PRIMARY KEY,
  "team_action_id" INTEGER NOT NULL,
  "field_name" VARCHAR(600) NOT NULL,
  "field_value" VARCHAR(600) NOT NULL,
  FOREIGN KEY ("team_action_id") REFERENCES "team_actions"("id")
);

CREATE TABLE "game_results" (
  "game_id" INTEGER PRIMARY KEY,
  "winner_team_id" INTEGER NOT NULL,
  "finalized_at" VARCHAR(600) NOT NULL,
  FOREIGN KEY ("winner_team_id") REFERENCES "game_teams"("id")
);

CREATE TABLE "game_result_rankings" (
  "id" INTEGER PRIMARY KEY,
  "game_id" INTEGER NOT NULL,
  "team_id" INTEGER NOT NULL,
  "rank" INTEGER NOT NULL,
  "score" REAL NOT NULL,
  FOREIGN KEY ("game_id") REFERENCES "game_results"("game_id"),
  FOREIGN KEY ("team_id") REFERENCES "game_teams"("id")
);

CREATE TABLE "capacity" (
  "id" INTEGER PRIMARY KEY,
  "game_team_id" INTEGER NOT NULL,
  "quantity" REAL,
  "seconds_x_unit" INTEGER,
  "hours_shift" INTEGER,
  "shifts" INTEGER,
  "production_lines" INTEGER,
  "week_working_days" INTEGER,
  "month_working_days" INTEGER,
  "year_working_months" INTEGER,
  "quality_yield" REAL,
  FOREIGN KEY ("game_team_id") REFERENCES "game_teams"("id"),
  FOREIGN KEY ("production_lines") REFERENCES "production_lines"("id")
);

CREATE TABLE "production_lines" (
  "id" INTEGER PRIMARY KEY,
  "code" VARCHAR(600),
  "product_id" INTEGER,
  "asset_id" INTEGER,
  "seconds_per_process" REAL,
  "needed_operators" INTEGER,
  "cycle_time" REAL,
  FOREIGN KEY ("product_id") REFERENCES "boms"("id"),
  FOREIGN KEY ("asset_id") REFERENCES "assets"("id")
);

CREATE TABLE "production_lines_phases" (
  "id" INTEGER PRIMARY KEY,
  "production_line_id" INTEGER NOT NULL,
  "phases" VARCHAR(600),
  "duration" REAL,
  "needed_personal" INTEGER,
  FOREIGN KEY ("production_line_id") REFERENCES "production_lines"("id")
);

CREATE TABLE "production_line_capacity_yearly" (
  "id" INTEGER PRIMARY KEY,
  "production_line_id" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "annual_capacity" REAL NOT NULL,
  FOREIGN KEY ("production_line_id") REFERENCES "production_lines"("id")
);

CREATE TABLE "inventary" (
  "id" INTEGER PRIMARY KEY,
  "game_team_id" INTEGER NOT NULL,
  "amount" INTEGER,
  "max_capacity" INTEGER,
  "maintenance_cost" REAL,
  FOREIGN KEY ("game_team_id") REFERENCES "game_teams"("id")
);

CREATE TABLE "project_programs" (
  "id" INTEGER PRIMARY KEY,
  "name" VARCHAR(600) NOT NULL,
  "description" VARCHAR(600),
  "created_by" INTEGER,
  "uploaded_at" VARCHAR(600) NOT NULL
);

CREATE TABLE "projects" (
  "id" INTEGER PRIMARY KEY,
  "program_id" INTEGER NOT NULL,
  "code" VARCHAR(600),
  "name" VARCHAR(600) NOT NULL,
  "description" VARCHAR(600),
  "initial_investment" REAL NOT NULL,
  "discount_rate" REAL NOT NULL,
  "duration_years" INTEGER NOT NULL,
  FOREIGN KEY ("program_id") REFERENCES "project_programs"("id")
);

CREATE TABLE "project_cash_flows_yearly" (
  "id" INTEGER PRIMARY KEY,
  "project_id" INTEGER NOT NULL,
  "year_offset" INTEGER NOT NULL,
  "cash_flow" REAL NOT NULL,
  FOREIGN KEY ("project_id") REFERENCES "projects"("id")
);

CREATE TABLE "solo_sessions" (
  "id" INTEGER PRIMARY KEY,
  "display_name" VARCHAR(600),
  "session_token" VARCHAR(600) NOT NULL UNIQUE,
  "started_at" VARCHAR(600) NOT NULL
);

CREATE TABLE "project_attempts" (
  "id" INTEGER PRIMARY KEY,
  "project_id" INTEGER NOT NULL,
  "game_team_student_id" INTEGER,
  "solo_session_id" INTEGER,
  "status" VARCHAR(600) NOT NULL DEFAULT 'in_progress',
  "initial_investment_override" REAL,
  "discount_rate_override" REAL,
  "started_at" VARCHAR(600) NOT NULL,
  "updated_at" VARCHAR(600),
  FOREIGN KEY ("project_id") REFERENCES "projects"("id"),
  FOREIGN KEY ("game_team_student_id") REFERENCES "game_team_students"("id"),
  FOREIGN KEY ("solo_session_id") REFERENCES "solo_sessions"("id"),
  CHECK (
    (game_team_student_id IS NOT NULL AND solo_session_id IS NULL)
    OR (game_team_student_id IS NULL AND solo_session_id IS NOT NULL)
  )
);

CREATE TABLE "project_attempt_cash_flows_yearly" (
  "id" INTEGER PRIMARY KEY,
  "project_attempt_id" INTEGER NOT NULL,
  "year_offset" INTEGER NOT NULL,
  "cash_flow" REAL NOT NULL,
  FOREIGN KEY ("project_attempt_id") REFERENCES "project_attempts"("id")
);

CREATE TABLE "project_attempt_evaluations" (
  "id" INTEGER PRIMARY KEY,
  "project_attempt_id" INTEGER NOT NULL,
  "van" REAL,
  "tir" REAL,
  "payback_years" REAL,
  "is_feasible" INTEGER NOT NULL,
  "evaluated_at" VARCHAR(600) NOT NULL,
  FOREIGN KEY ("project_attempt_id") REFERENCES "project_attempts"("id")
);

CREATE TABLE "file_attachments" (
  "id" INTEGER PRIMARY KEY,
  "game_team_order_id" INTEGER,
  "employee_id" INTEGER,
  "expense_id" INTEGER,
  "team_action_id" INTEGER,
  "project_program_id" INTEGER,
  "project_id" INTEGER,
  "r2_bucket" VARCHAR(600) NOT NULL,
  "r2_key" VARCHAR(600) NOT NULL,
  "file_name" VARCHAR(600) NOT NULL,
  "content_type" VARCHAR(600),
  "size_bytes" INTEGER,
  "uploaded_by" INTEGER,
  "uploaded_at" VARCHAR(600) NOT NULL,
  FOREIGN KEY ("game_team_order_id") REFERENCES "game_team_orders"("id"),
  FOREIGN KEY ("employee_id") REFERENCES "employees"("id"),
  FOREIGN KEY ("expense_id") REFERENCES "expenses"("id"),
  FOREIGN KEY ("team_action_id") REFERENCES "team_actions"("id"),
  FOREIGN KEY ("project_program_id") REFERENCES "project_programs"("id"),
  FOREIGN KEY ("project_id") REFERENCES "projects"("id"),
  CHECK (
    (CASE WHEN game_team_order_id IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN employee_id IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN expense_id IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN team_action_id IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN project_program_id IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN project_id IS NOT NULL THEN 1 ELSE 0 END) = 1
  )
);

-- =====================================================================
-- Indices
-- =====================================================================

CREATE UNIQUE INDEX "idx_schedules_name" ON "schedules" ("name");
CREATE INDEX "idx_game_teams_game_id" ON "game_teams" ("game_id");
CREATE UNIQUE INDEX "idx_premises_yearly_game_id_year" ON "premises_yearly" ("game_id", "year");
CREATE UNIQUE INDEX "idx_premises_percentage_yearly_game_id_year" ON "premises_percentage_yearly" ("game_id", "year");
CREATE UNIQUE INDEX "idx_premises_deprecations_yearly_game_id_year" ON "premises_deprecations_yearly" ("game_id", "year");
CREATE UNIQUE INDEX "idx_purchase_order_monthly_distribution_game_id_month" ON "purchase_order_monthly_distribution" ("game_id", "month");
CREATE UNIQUE INDEX "idx_purchase_order_yearly_total_game_id_year" ON "purchase_order_yearly_total" ("game_id", "year");
CREATE UNIQUE INDEX "idx_asset_cost_yearly_asset_id_year" ON "asset_cost_yearly" ("asset_id", "year");
CREATE UNIQUE INDEX "idx_employee_compensation_items_employee_id_item_name" ON "employee_compensation_items" ("employee_id", "item_name");
CREATE UNIQUE INDEX "idx_game_result_rankings_game_id_team_id" ON "game_result_rankings" ("game_id", "team_id");
CREATE UNIQUE INDEX "idx_game_result_rankings_game_id_rank" ON "game_result_rankings" ("game_id", "rank");
CREATE UNIQUE INDEX "idx_production_line_capacity_yearly_production_line_id_year" ON "production_line_capacity_yearly" ("production_line_id", "year");
CREATE UNIQUE INDEX "idx_project_cash_flows_yearly_project_id_year_offset" ON "project_cash_flows_yearly" ("project_id", "year_offset");
CREATE UNIQUE INDEX "idx_project_attempts_project_id_game_team_student_id" ON "project_attempts" ("project_id", "game_team_student_id");
CREATE UNIQUE INDEX "idx_project_attempts_project_id_solo_session_id" ON "project_attempts" ("project_id", "solo_session_id");
CREATE UNIQUE INDEX "idx_project_attempt_cash_flows_yearly_project_attempt_id_year_offset" ON "project_attempt_cash_flows_yearly" ("project_attempt_id", "year_offset");
CREATE INDEX "idx_project_attempt_evaluations_project_attempt_id" ON "project_attempt_evaluations" ("project_attempt_id");
CREATE UNIQUE INDEX "idx_file_attachments_r2_bucket_r2_key" ON "file_attachments" ("r2_bucket", "r2_key");
