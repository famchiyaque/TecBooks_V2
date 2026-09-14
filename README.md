# TecBooks V2

Educational web app for exploring project evaluation and business finances. Students can upload structured Excel templates (or use standalone simulators) to analyze investment metrics, statements, and forecasts through a shared **Canonical Business Model (CBM)** feeding a unified dashboard.

## Overview

TecBooks turns business inputs into a single internal model, then surfaces financial insight in the browser:

1. **Input** — download/fill an Excel template (Mexico manufacturing is the main path today), or use the custom Excel builder / standalone sims.
2. **Adapt** — source adapters map sheet data into the CBM via a factory + validators.
3. **Dashboard** — project evaluation, overview, accounting, forecasts, and finances views consume that model.

That flow is one of **two product areas** in the app. The other is the account-backed **[Evaluador de Proyectos](#evaluador-de-proyectos-project-feasibility)**, where students upload an `InputNovus` workbook and get a *persisted* project (stored in Cloudflare D1 via the `worker/` API) instead of a one-off, in-browser CBM. See [Main features](#main-features) below for both in detail.

Architecture notes for teammates: [`documentation/app_architecture/NEW_PROJECT_STRUCTURE.md`](documentation/app_architecture/NEW_PROJECT_STRUCTURE.md) and [`documentation/diagrams/CBM_WORKFLOW.md`](documentation/diagrams/CBM_WORKFLOW.md).

## Onboarding

The app is two independent pnpm projects in one repo: the **frontend** (this root folder, a Vite/React SPA) and the **API** (`worker/`, a Cloudflare Worker). You'll run both locally.

### 1. Prerequisites

- **Node.js** (current LTS recommended)
- **[pnpm](https://pnpm.io)**
- No Cloudflare account needed for local dev — Wrangler fully emulates Workers, D1 and R2 on your machine (see [Cloudflare architecture](#cloudflare-architecture)). You only need one to deploy.

### 2. Install dependencies (both projects)

```bash
cd TecBooks_V2
pnpm install            # frontend deps

cd worker
pnpm install            # worker deps
cd ..
```

### 3. Configure environment

- Root: copy `.env.example` → `.env`. Defaults already point at a locally-running worker (`VITE_WORKER_API_URL=http://localhost:8787`).
- `worker/`: create `worker/.dev.vars` (already in `.gitignore` — never commit it) with:
  ```
  CLERK_SECRET_KEY=sk_test_...   # from https://dashboard.clerk.com
  JWT_SECRET=any-random-string-for-local-dev
  ```

### 4. Set up the local database

D1 runs locally as a real SQLite file managed by Wrangler — it starts empty and needs migrations applied once. **`main` and `develop` are two entirely separate local SQLite files** (see [Cloudflare architecture](#cloudflare-architecture)) — migrating one does **not** migrate the other, and running the wrong pair (worker started with one env, migrations applied to the other) is the #1 source of confusing local errors:

- `D1_ERROR: no such table: X` → you're pointed at a DB that hasn't been migrated at all yet.
- `D1_ERROR: table X has no column named Y` → you're pointed at a DB that's behind on migrations (someone added a newer migration and you only ran the old ones, or you migrated the *other* env by mistake).

Pick **one** environment and migrate **that same one**:

```bash
cd worker

# if you'll run `pnpm run dev` (plain, no --env flag → targets tecbooks-db / "main")
pnpm run db:migrate:local

# if you'll run `pnpm run dev:develop` (--env develop → targets tecbooks-db-develop)
pnpm run db:migrate:local:develop
```

Whenever a PR adds a new file under `worker/migrations/`, re-run the matching `db:migrate:local*` command for whichever env you actually use locally — migrations are **not** applied automatically when you pull.

### 5. Run it

Two terminals. Pick the same environment you migrated in step 4 for the API terminal:

```bash
# Terminal 1 — API (main, the default — needs step 4's plain db:migrate:local)
cd worker
pnpm run dev                # http://127.0.0.1:8787, uses tecbooks-db

# Terminal 1 — API, alternative (develop — needs step 4's db:migrate:local:develop instead)
cd worker
pnpm run dev:develop        # http://127.0.0.1:8787, uses tecbooks-db-develop

# Terminal 2 — frontend (same either way)
pnpm run dev                # http://localhost:5173
```

Open `http://localhost:5173` (redirects to `/home`). Signing up should create a row in the local D1 `users` table through the worker + Clerk. If you see a `D1_ERROR` like the ones above, go back to step 4 and migrate the DB matching whichever `pnpm run dev*` command you're using in the API terminal.

> Large production builds may need more Node heap, e.g.
> `NODE_OPTIONS=--max-old-space-size=8192 pnpm run build`
> (on Windows PowerShell: `$env:NODE_OPTIONS="--max-old-space-size=8192"; pnpm run build`).

## Commands reference

### Frontend (repo root)

| Script | Purpose |
|--------|---------|
| `pnpm run dev` | Local development server |
| `pnpm run build` | Production build → `dist/` |
| `pnpm run preview` | Serve the production build locally |
| `pnpm run lint` | ESLint |
| `pnpm run deploy:main` | Build + deploy to Cloudflare Pages (production) |
| `pnpm run deploy:develop` | Build + deploy to Cloudflare Pages (`develop`) |

### API (`cd worker`)

| Script | Purpose |
|--------|---------|
| `pnpm run dev` | Local Worker dev server (`http://127.0.0.1:8787`), local D1/R2 |
| `pnpm run dev:develop` | Same, but loads the `develop` env config/bindings |
| `pnpm run deploy:main` | Deploy the Worker to production |
| `pnpm run deploy:develop` | Deploy the Worker to the `develop` env |
| `pnpm run db:migrate:local` | Apply pending migrations to the local **main** D1 |
| `pnpm run db:migrate:local:develop` | Apply pending migrations to the local **develop** D1 |
| `pnpm run db:migrate:main` | Apply pending migrations to the **remote production** D1 |
| `pnpm run db:migrate:develop` | Apply pending migrations to the **remote develop** D1 |
| `pnpm run types` | Regenerate `worker-configuration.d.ts` from `wrangler.jsonc` |
| `pnpm run tail:main` / `tail:develop` | Stream live logs from the deployed Worker |

## Cloudflare architecture

TecBooks runs entirely on Cloudflare's edge platform — there's no separate server to provision.

| Piece | Service | Configured in |
|-------|---------|----------------|
| Frontend (this app) | **Pages** | `deploy:*` scripts (root `package.json`) |
| API | **Workers** (Hono framework) | `worker/wrangler.jsonc`, `worker/src/index.js` |
| Database | **D1** (SQLite at the edge) | `worker/wrangler.jsonc` bindings; schema in `worker/migrations/` |
| File storage | **R2** | bucket `tecbooks-testing`, binding `R2` |

Two environments run end to end:

- **main / production** — `tecbooks-frontend` (Pages) + `tecbooks-worker` (Worker) + `tecbooks-db` (D1)
- **develop** — `tecbooks-frontend-develop` (Pages) + `tecbooks-worker-develop` (Worker, `--env develop`) + `tecbooks-db-develop` (D1)

Locally, `wrangler dev` emulates Workers, D1 and R2 with [Miniflare](https://developers.cloudflare.com/workers/testing/miniflare/) — state lives under `worker/.wrangler/state/` (gitignored) as real SQLite files, so nothing touches your actual Cloudflare account until you deploy or pass `--remote`. The local **main** and **develop** D1 databases are separate files too — migrating one does not migrate the other (see step 4 of [Onboarding](#onboarding)).

`.github/workflows/deploy-dev.yml` only pings a webhook on push to `develop`; it doesn't build or deploy anything itself — actual deploys are the `deploy:*` pnpm scripts above.

## Technologies

| Area | Stack |
|------|--------|
| UI | React 19, React Router |
| Build | Vite 7 |
| Styling | Tailwind CSS, MUI, some CSS modules / global styles |
| State | React Context (dashboard), Redux Toolkit (simulators & custom Excel builder) |
| Charts | Chart.js, Recharts, Highcharts, FusionCharts (by feature) |
| Spreadsheets | SheetJS (`xlsx`), ExcelJS |
| Forms / validation | React Hook Form, Zod (where used) |

## Main features

### Financial dashboard

The product spine for filled business templates.

**How you get there**

1. Browse templates at `/modules/templates`
2. Upload a filled workbook at `/modules/templates/upload`
3. The app adapts → validates → stores the CBM in `sessionStorage`, then opens `/dashboard`

**What you get**

| Route | Focus |
|-------|--------|
| `/dashboard/project-evaluation` | IRR, NPV, ROI, break-even, cashflow charts |
| `/dashboard/overview` | Premises / forecasting method controls and business summary |
| `/dashboard/accounting` | Financial statements |
| `/dashboard/forecasts` | Projection-oriented views (wired to the forecasting utilities) |
| `/dashboard/finances` | Finance KPIs / health-style views |

Under the hood, `DashboardProvider` holds the hydrated CBM and runs calculation helpers in `utils/dashboard/` (metrics, statements, cashflow, derivations). Pages read data through `useDashboard()` rather than re-parsing Excel.

### Simulators

Lightweight, self-contained tools under `/sims`. Each page creates its own Redux store so the root app stays free of feature providers.

| Simulator | Route | What it does |
|-----------|--------|----------------|
| **Project evaluation** | `/sims/project-evaluation` | Manual cashflow inputs (investment, inflows/outflows, discount rate, lifetime) → NPV, IRR, ROI, break-even, with history of runs |
| **Sales forecasting** | `/sims/forecasting` | Generate or upload sales series, pick intervals/patterns, compare forecasting methods on a chart |

These sims do **not** require a full CBM upload; they are teaching/exploration tools alongside the dashboard path.

### Evaluador de Proyectos (Project Feasibility)

Account-backed module under `/sims/project-feasibility`, separate from the CBM dashboard and from the standalone sims above. Students log in, upload an `InputNovus` Excel workbook to create a **program**, and get a persisted **project** with its own dashboard:

| Route | Screen |
|-------|--------|
| `/sims/project-feasibility/programs` | Portal — list of the user's programs / create a new one |
| `/sims/project-feasibility/programs/new` | Upload flow — stage and validate an `InputNovus` workbook before creating a program |
| `/sims/project-feasibility/programs/:programId/:projectId` | Project dashboard — Cost Table, Balance Sheet (Assets/Passives/Equity), Income, Outflows, Cash Flow, and Ratios tabs |

Data is persisted through the `worker/` API into D1 (`programs`, `projects`, `feasibility_programs`, `feasibility_projects` and related tables) rather than kept only in `sessionStorage`, so a program survives across sessions. Requires authentication (`RequireAuth`); see [`src/sims/project-feasibility/`](src/sims/project-feasibility/) for the calculation modules (balance, income, flow, cost table) and [`worker/src/models/`](worker/src/models/) / [`worker/src/services/feasibility-model.service.js`](worker/src/services/feasibility-model.service.js) for the backend side.

Requirement docs (as-built, kept current with the code): [`documentation/requirements/50CreateTableOfCosts/`](documentation/requirements/50CreateTableOfCosts/) (activity/sequence diagrams for add/modify/delete cost rows and the cost-table Redux hook flow).

## Useful routes

| Path | Screen |
|------|--------|
| `/home` | Landing |
| `/modules/templates` | Template picker |
| `/modules/templates/upload` | Template upload → dashboard |
| `/modules/custom-excel` | Questionnaire that builds a custom Excel structure |
| `/dashboard/*` | Unified financial dashboard |
| `/sims/project-evaluation` | Investment simulator |
| `/sims/forecasting` | Forecasting simulator |
| `/sims/project-feasibility/programs` | Evaluador de Proyectos — programs portal (auth required) |
| `/faq` | FAQ |
| `/mxrep/*` | MxRep educational module (isolated; separate from the CBM dashboard spine) |

## Documentation

- Structure & conventions — [`documentation/app_architecture/NEW_PROJECT_STRUCTURE.md`](documentation/app_architecture/NEW_PROJECT_STRUCTURE.md)
- CBM data flow — [`documentation/diagrams/CBM_WORKFLOW.md`](documentation/diagrams/CBM_WORKFLOW.md)
- Evaluador de Proyectos / cost table requirements (up to date) — [`documentation/requirements/50CreateTableOfCosts/`](documentation/requirements/50CreateTableOfCosts/)
- Broader docs tree — [`documentation/`](documentation/)
