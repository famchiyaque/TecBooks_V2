# TecBooks V2

Educational web app for exploring project evaluation and business finances. Students can upload structured Excel templates (or use standalone simulators) to analyze investment metrics, statements, and forecasts through a shared **Canonical Business Model (CBM)** feeding a unified dashboard.

## Overview

TecBooks turns business inputs into a single internal model, then surfaces financial insight in the browser:

1. **Input** — download/fill an Excel template (Mexico manufacturing is the main path today), or use the custom Excel builder / standalone sims.
2. **Adapt** — source adapters map sheet data into the CBM via a factory + validators.
3. **Dashboard** — project evaluation, overview, accounting, forecasts, and finances views consume that model.

Architecture notes for teammates: [`documentation/app_architecture/NEW_PROJECT_STRUCTURE.md`](documentation/app_architecture/NEW_PROJECT_STRUCTURE.md) and [`documentation/diagrams/CBM_WORKFLOW.md`](documentation/diagrams/CBM_WORKFLOW.md).

## Install and run

Requirements: **Node.js** (current LTS recommended) and npm.

```bash
cd TecBooks_V2
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The app redirects `/` → `/home`.

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

> Large production builds may need more Node heap, e.g.  
> `NODE_OPTIONS=--max-old-space-size=8192 npm run build`  
> (on Windows PowerShell: `$env:NODE_OPTIONS="--max-old-space-size=8192"; npm run build`).

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
| `/faq` | FAQ |
| `/mxrep/*` | MxRep educational module (isolated; separate from the CBM dashboard spine) |

## Documentation

- Structure & conventions — [`documentation/app_architecture/NEW_PROJECT_STRUCTURE.md`](documentation/app_architecture/NEW_PROJECT_STRUCTURE.md)
- CBM data flow — [`documentation/diagrams/CBM_WORKFLOW.md`](documentation/diagrams/CBM_WORKFLOW.md)
- Broader docs tree — [`documentation/`](documentation/)
