# Patterns

Project Feasibility V1: one user uploads year-0 InputNovus workbooks, grouped as a **program** (thin folder). Each Excel is one **actual operating business** → one `games` row + one `game_teams` row. Not a shop catalog, not a classroom lobby.

## Worker layers

```
routes → logger + session → controllers → usecases → services → models → env.DB / env.R2
```

Copy `worker/src/routes/programs.route.js` and `auth`. Pages and React components do **not** import axios. HTTP lives in `src/api/**`. Hooks call those functions.

## Identity and storage

- Program: `feasibility_programs` (`name`, `created_by`).
- Child: `feasibility_projects` (`program_id`, `name`, `game_id`, `r2_key`). Not VAN `projects`.
- `games.class_id`: find-or-create class **"Project Feasibility"** under school slug **`general`**.
- Original Excel → R2 binding **`env.R2`**. Object key: `feasibility/{userId}/{programId}/{gameId}/{filename}`. Persist that string as `r2_key`. No R2 access key in `.env`; bucket name is `wrangler.jsonc` → `r2_buckets[].bucket_name`.
- Do **not** persist `derivedBase` or a `cbm_json` blob.
- `employees.schedule` is a schema default (`full-time` row in migrations). Not an Excel field.

## Catalog (list / sidebar / cards)

| | |
|---|---|
| HTTP | `GET /api/programs` (session cookie) |
| Shape | `{ id, name, createdAt, projects: [{ id, name, gameId, r2Key }] }` |
| Client | `listProgramsRequest` → TanStack `queryKey: ['programs']` (`ProgramsContext`, `useProgram`) |
| After POST | `invalidateQueries({ queryKey: ['programs'] })` |

Upload is multipart: `name`, `projects` (JSON, CBM **without** `derivedBase`), `files` (one Excel per project, same order). Parse stays on the client; the worker explodes the CBM into Novus tables.

## Tab data (financial statements)

**Do not** read `project.cbm` from the catalog GET. It is not there.

**Current (compat — see `technical-debt.md`):**

| | |
|---|---|
| HTTP | `GET /api/feasibility/:gameId` |
| Client | `useFeasibilityModel(project.gameId)` → `queryKey: ['feasibility-model', gameId]` |
| Where | `src/hooks/sims/project/useFeasibilityModel.js` |
| Wired in | `ProjectDashboard` TabContent attaches `{ ...project, cbm }` for Income / Expenses / Ratios / Flujo |

**New work:** add a tab-scoped GET + TanStack key (table above in `technical-debt.md`). Query Novus tables by `gameId` (`premises`, `expenses`, `game_team_employees`, `game_team_assets`, `boms`, `capacity`, purchase orders). Never hardcode `gameId = 1`. `enabled: Number.isInteger(gameId) && gameId > 0`.

## Client folders

- Sim HTTP: `src/api/sims/<feature>/`
- Sim hooks: `src/hooks/sims/project/`
- Worker feature: `worker/src/{routes,controllers,usecases,services,models,mappers}/`
- Redux in this sim: edit slices only (`src/store/costTable.store.js`), not the project document.
