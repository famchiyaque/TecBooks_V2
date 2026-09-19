# Project Feasibility — Initial GET Workflow

After upload, the UI does **not** keep the staged CBM. It reloads a thin catalog, then each dashboard tab fetches a rebuilt Excel-shaped CBM from Novus tables.

This fat CBM GET is a compat layer. See `.agents/technical-debt.md`. Do not put `cbm` back on `GET /api/programs`.

## One-sentence version

**`GET /api/programs` returns folder ids + `gameId` → open a project → `GET /api/feasibility/:gameId` rebuilds CBM from D1 → client `applyDerivedBase` → tabs read `project.cbm`.**

## Diagram

```mermaid
flowchart TB
  subgraph CATALOG["Catalog — GET /api/programs"]
    list[listFeasibilityProgramsByCreatedBy]
    kids[listFeasibilityProjectsByProgramId]
    shape["{ id, name, createdAt, projects: [{ id, name, gameId, r2Key }] }"]
    tanstack["TanStack queryKey: ['programs']"]
  end

  subgraph OPEN["Open /programs/:programId/:projectId"]
    find[findProgramProject]
    tab[TabContent]
  end

  subgraph MODEL["Tab data — GET /api/feasibility/:gameId"]
    own[getOwnedGame]
    read[feasibility-read.model: premises*, employees, assets, BOM, capacity, demand, expenses]
    rebuild[mapGameRowsToCbm]
    derive[client applyDerivedBase]
    cache["TanStack queryKey: ['feasibility-model', gameId]"]
    attach["projectWithCbm = { ...project, cbm }"]
  end

  list --> kids --> shape --> tanstack --> find --> tab
  tab --> own --> read --> rebuild --> derive --> cache --> attach
  attach --> Income
  attach --> Outflows
  attach --> Ratios
  attach --> CashFlow
  attach --> Balance
```

## Two payloads

### 1. Catalog (no CBM)

Used by the portal cards, sidebar, and to resolve `:programId/:projectId`.

```text
GET /api/programs
→ [{
    id, name, createdAt, createdBy,
    projects: [{ id, programId, name, gameId, r2Key }]
  }]
```

`r2Key` is the original Excel archive. Tabs do not read it.

### 2. Rebuilt CBM (compat)

```text
GET /api/feasibility/:gameId
→ mapGameRowsToCbm(...)     // metadata.source = 'novus-tables', no derivedBase
→ applyDerivedBase(data)    // same helper as staging; fills derivedBase again
```

| DB | Back onto CBM |
|---|---|
| `games` | `metadata.name`, `timeline.years` from `start_date`/`end_date` |
| `premises` + `_yearly` | rate series (`fxClose`, inflation, ISR, …) |
| `premises_percentage` + `_yearly` | policy % series |
| `premises_deprecations` + `_yearly` | 4 legacy fields + `depreciationByCategory` |
| `expenses` | `services[]` (`monthlyAmount` ← `default_cost`) |
| `assets` + `asset_cost_yearly` | `assets.byCategory` + legacy buckets; `category = machine` → `capacity.machines` with `operators: 0` |
| `employees` + compensation + `game_team_employees` | `employees[]` (`cantidad` from link quantity; `job_title` → type) |
| `boms` + `required_materials` | `bom.productName`, `salePrice`, `parts[]` |
| `capacity` + `production_lines` | line params; `productionLines` hardcoded **1**, `monthsWorkingWeeks` hardcoded **4** |
| `purchase_order_yearly_total` + monthly % | `yearZeroTotal`, `monthShares`; **monthly orders rebuilt as `total × share`** |

Then `applyDerivedBase` recomputes BOM cost, year-0 CO sum, capacity, classified employees — from this rebuilt base, not from a stored blob.

## Sequence

```mermaid
sequenceDiagram
  participant Portal as ProgramsPortal / Sidebar
  participant QC as TanStack ['programs']
  participant Dash as ProjectDashboard
  participant FM as useFeasibilityModel
  participant API as GET /api/feasibility/:gameId
  participant Map as mapGameRowsToCbm
  participant Tab as Income / Outflows / …

  Portal->>QC: listProgramsRequest
  QC-->>Portal: programs without cbm
  Note over Dash: user opens a project
  Dash->>QC: findProgramProject → project.gameId
  Dash->>FM: useFeasibilityModel(gameId)
  FM->>API: cookie session
  API->>API: getOwnedGame(gameId, userId)
  API->>Map: Novus rows
  Map-->>FM: CBM without derivedBase
  FM->>FM: applyDerivedBase
  FM-->>Dash: project.cbm
  Dash->>Tab: { ...project, cbm }
```

## Where to look

| Step | File |
|------|------|
| Catalog client | `src/sims/project-feasibility/api/programs.api.js` (`listProgramsRequest`) |
| Catalog cache | `src/sims/project-feasibility/pages/ProgramsContext.jsx` |
| Dashboard | `src/sims/project-feasibility/pages/ProjectDashboard.jsx` |
| Tab hook | `src/hooks/sims/project/useFeasibilityModel.js` |
| Client GET + derive | `src/api/sims/feasibility/getFeasibilityModel.service.js` |
| Route | `worker/src/routes/feasibility.route.js` |
| Read + rebuild | `worker/src/services/feasibility-model.service.js` |
| Row → CBM | `worker/src/mappers/game-to-cbm.mapper.js` |
