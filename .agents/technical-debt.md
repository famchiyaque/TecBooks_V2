# Technical debt

## Fat CBM GET for every financial tab

**What shipped:** `GET /api/feasibility/:gameId` rebuilds a full Excel-shaped CBM from Novus rows (`premises*`, `expenses`, employees, assets, BOM, capacity, demand). The client caches it with TanStack (`['feasibility-model', gameId]`) and attaches it as `project.cbm`. Income, Outflows, Cost Table, Profit, Break-even, and Flujo still run the old client `compute*` / `buildCostOfSales` / `useOutflows` / `useIncome` on that blob.

**Why it exists:** Upload no longer returns `cbm_json` on `GET /api/programs`. Teammate tabs assumed `project.cbm` was still on the catalog payload. The fat GET was a compat layer so those tabs would stop crashing without rewriting every calculator this week.

**Source of truth is already correct:** D1 Novus tables + `project.gameId`. The debt is the **contract** — one model for every screen, extra payload, client math still coupled to Excel-shaped JSON.

**Replace with:** one GET per tab, keyed by `gameId`, returning only that table’s rows. Examples:

| Tab | Intended query key | Intended payload |
|---|---|---|
| Outflows | `['expenses', gameId]` | years, admin series, investment lines, services, amortization, financials |
| Income | `['income', gameId]` | production costs, utility, competitive price |
| Cost / Ratios | `['cost-table', gameId]` | cost-of-sales / profit / break-even inputs |
| Flujo | `['cash-flow', gameId]` | inflows and outflows by year |

Math may live on the worker or in a hook that only sees that slice. Do not add new features that require a fuller CBM. Do not put `cbm` back on `GET /api/programs`.

**When this debt is gone:** `GET /api/feasibility/:gameId`, `useFeasibilityModel`, and `project.cbm` on the dashboard go away.

## Related leftovers

- `GET /api/expenses?gameId=` still exists (old seed-shaped payload). Outflows UI does **not** use it; it uses the fat CBM. Do not hardcode `gameId = 1`.
- `Empleados` `Cantidad` is blank for **MOD Operador** and **MOD Supervisor** (filled from Capacidad: sum of machine operators, one supervisor per machine). Upload currently persists empty as `1`.
- Redux `costTable` slices are **cell edits only**. REQ-00’s “Redux is the session CBM database” was never built. Do not revive it.
