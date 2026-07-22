# TecBooks V2 — Project Structure (Post-Refactor)

This document explains the folder layout after the architecture cleanup branch. Read it if you are joining the project and need a map of where things live.

## Why we refactored

The codebase grew as several semi-independent “mini-apps” (`dashboard/views`, duplicated modules, adapters buried under `core`, model + validation + static data mixed in one place). That made ownership unclear and made the Canonical Business Model (CBM) hard to trust.

Goals of this branch:

1. Use conventional React layout (`pages/`, `components/`, `hooks/`, `utils/`, `config/`, `models/`).
2. Make adapters → CBM → dashboard the obvious spine.
3. Give the CBM one factory, separate validators/operations, and real config files.
4. Leave MxRep isolated on purpose (see below).

## Top-level `src/` map

```text
src/
  adapters/          # Input sources → CBM (Excel, custom-excel, mxrep stubs)
  api/               # API helpers (dashboard / shared)
  assets/            # Static assets
  components/        # UI by feature area (dashboard, sims, global, ui, …)
  config/            # Lookup data & app config (not React, not calculations)
  contexts/          # React context providers (Dashboard, Navigation, …)
  hooks/             # Shared / feature hooks
  lib/               # Tiny shared libs (e.g. shadcn `utils`)
  models/            # Domain models (Canonical Business Model)
  MxRep/             # Isolated educational module (intentional island)
  pages/             # Route-level screens (flat where possible; dashboard/ + sims/ kept as groups)
  store/             # Feature Redux stores (*.store.js); created inside the page that needs them
  styles/            # Global / feature CSS
  utils/             # Pure helpers (dashboard calculations, sims, faq, numbers)
```

### Mental model

| Concern | Lives in | Example |
|--------|----------|---------|
| “What URL am I on?” | `pages/` | `pages/dashboard/Accounting.jsx` |
| “What UI piece is this?” | `components/` | `components/dashboard/Sidebar.jsx` |
| “How do I turn Excel into our model?” | `adapters/` | `adapters/excel/mexico-manufacturing.adapter.js` |
| “What is a valid business model?” | `models/canonical-business-model/` | factory + validators |
| “Country tax / premises defaults” | `config/business/` | `premises.config.js` |
| “IRR / statements / cashflow math” | `utils/dashboard/` | `projectMetrics.js`, `statements.js` |
| “Dashboard shared state” | `contexts/DashboardContext.jsx` | `useDashboard()` |

Rule of thumb: **pages wire routes**, **components render**, **adapters translate inputs**, **models define shape + rules**, **config holds static defaults**, **utils compute**.

## Folder flattening (what changed)

### Dashboard (biggest flatten)

**Before (nested feature island):**

```text
dashboard/
  views/...
  components/...
  MainLayout.jsx / Router.jsx
```

**After (app-wide convention):**

```text
pages/dashboard/          # Route screens
  Index.jsx               # Loads CBM, wraps provider, defines nested routes
  Layout.jsx
  ProjectEvaluation.jsx
  Overview.jsx
  Accounting.jsx          # was “statements”
  Forecasts.jsx
  Finances.jsx            # was “finance-kpis”
components/dashboard/     # Dashboard-only UI
utils/dashboard/          # Calculations that feed the dashboard
contexts/DashboardContext.jsx
```

Same idea for home, FAQ, modules, and sims: **route entry under `pages/`**, **widgets under `components/<area>/`**.

### Adapters (promoted to top level)

Adapters are first-class, not buried under a `core/` or `utils/` folder:

```text
adapters/
  excel/
    excel.adapter.js
    mexico-manufacturing.adapter.js   # active manufacturing path
  custom-excel/
    custom-excel.adapter.js           # exported stub / future path
  mxrep/
    mxrep.adapter.js                  # exported stub / future path
  index.js
```

Active upload today: `pages/TemplateUpload.jsx` → Mexico adapter if a `Welcome` sheet exists, else generic Excel adapter.

### Config vs model vs utils

Static lookup tables left the old model folder:

```text
config/business/
  countries.config.js
  premises.config.js
  employee-benefits.config.js
  forecasting-methods.config.js

config/sims/forecasts/
  options.config.js
```

The CBM factory **reads** business config. Adapters should not hardcode country premises; they call the factory and then fill source-specific fields.

Shared numeric helpers live in `utils/number.utils.js` (`sanitizeNumber`, etc.), not inside the model module.

## Canonical Business Model layout

```text
models/canonical-business-model/
  canonical-business-model.factory.js      # create + hydrate
  canonical-business-model.validators.js   # shape / contract checks
  canonical-business-model.operations.js   # light helpers (summary, merge)
  index.js                                 # public barrel — import from here
  fixtures/test.md                         # sample fixture (reference)
```

| File | Responsibility |
|------|----------------|
| **factory** | Only approved way to construct a fresh CBM; applies country defaults from config |
| **validators** | Answers “is this object a usable CBM?” |
| **operations** | Small model helpers that are neither construction nor validation |
| **index** | Re-exports the public API |

The CBM is a **plain serializable object** (no class), because it must survive `JSON.stringify` → `sessionStorage` → `JSON.parse`.

Detailed runtime flow: see [`../diagrams/CBM_WORKFLOW.md`](../diagrams/CBM_WORKFLOW.md).

## MxRep — left isolated on purpose

`src/MxRep/` remains a self-contained module with its own Views, Forms, Components, Routing, and utils.

**Why:**

- It is a large educational product surface with its own auth/panels/game flows.
- Rewiring it into the unified CBM + dashboard was **out of scope** for this refactor.
- Merging it early would blur ownership and slow the cleanup of the dashboard spine.

**How it connects today:**

- Mounted at `/mxrep/*` via `App.jsx` → `MxRep/Routing/Router.jsx`.
- There is an `adapters/mxrep/mxrep.adapter.js` stub toward a future CBM bridge; it is **not** the active upload path.

**Guidance for teammates:** treat MxRep as an island. Prefer not to import MxRep internals from dashboard/pages (and vice versa) unless you are explicitly working on integration. Shared UI that both need should live under `components/global/` or another neutral place — after deliberate design, not by accident.

## Naming conventions (current)

- React components / contexts: `PascalCase.jsx` (`DashboardContext.jsx`).
- Non-React modules: **kebab-case** with role suffix when useful:
  - `*.adapter.js`, `*.factory.js`, `*.validators.js`, `*.operations.js`, `*.config.js`, `*.utils.js`
- Public CBM functions: `createCanonicalBusinessModel`, `hydrateCanonicalBusinessModel`, `validateCanonicalBusinessModel`.
- Import the model through `@/models/canonical-business-model` (the barrel), not deep file paths, when possible.

## What this branch did *not* try to finish

Useful so reviewers don’t expect more than shipped:

- Full MxRep → CBM → unified dashboard integration
- Wiring custom-excel / mxrep adapters into TemplateUpload
- Moving all `__tests__` into a top-level `tests/` tree
- Redesigning dashboard calculation engines
- Programs / multi-business collections architecture

## Where to start as a new teammate

1. Skim this file and [`CBM_WORKFLOW.md`](../diagrams/CBM_WORKFLOW.md).
2. Trace one happy path: `TemplateUpload.jsx` → Mexico adapter → factory → validator → `sessionStorage` → `pages/dashboard/Index.jsx` → `DashboardContext`.
3. Open `models/canonical-business-model/canonical-business-model.factory.js` to see the full CBM shape.
4. Only then open a dashboard page (`ProjectEvaluation.jsx`) and see what it reads from `useDashboard()`.
