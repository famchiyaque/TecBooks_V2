# Project Feasibility — POST Workflow

Confirm on the New Program page sends parsed CBM JSON plus the original Excel files. The worker never opens Excel. It flattens each CBM into Novus table rows and archives the workbook in R2.

## One-sentence version

**Strip `derivedBase` → multipart `POST /api/programs` → `mapCbmToGamePlan` → insert `games` / team / premises / expenses / assets / employees / BOM / demand → put Excel in R2 → insert `feasibility_projects` (`game_id`, `r2_key`).**

## Diagram

```mermaid
flowchart TB
  subgraph CLIENT["Browser"]
    strip["Strip derivedBase from each staged project"]
    form["FormData: name, projects JSON, files"]
    post["POST /api/programs cookie session"]
  end

  subgraph WORKER["Worker"]
    session[sessionMiddleware]
    zod[createProgramRequestSchema]
    files{file count = project count?}
    classId[find-or-create class "Project Feasibility"]
    program[INSERT feasibility_programs]
    map[mapCbmToGamePlan]
    persist[persistGameFromPlan]
    r2["R2 put feasibility/{userId}/{programId}/{gameId}/{file}"]
    child[INSERT feasibility_projects]
    fail[on error: delete program, games, R2 keys]
  end

  strip --> form --> post --> session --> zod --> files
  files -->|mismatch| err400[400 file_count_mismatch]
  files -->|ok| classId --> program --> map --> persist --> r2 --> child
  persist --> fail
  r2 --> fail
```

## Payload vs flattened plan

Client POST body (logical):

```text
{
  name: "Program name",
  projects: [{ name, cbm }],   // CBM without derivedBase
  files:   [File, ...]         // same order as projects
}
```

`mapCbmToGamePlan(cbm, name)` is a **write plan**, not stored as JSON. `persistGameFromPlan` explodes it:

```mermaid
flowchart LR
  subgraph PLAN["mapCbmToGamePlan"]
    game[plan.game]
    prem[plan.premises]
    exp[plan.expenses]
    ast[plan.assets]
    emp[plan.employees]
    bom[plan.bom]
    cap[plan.capacity]
    dem[plan.demand]
  end

  subgraph D1["D1"]
    games[games]
    teams[game_teams]
    p1[premises + premises_yearly]
    p2[premises_percentage + _yearly]
    p3[premises_deprecations + _yearly]
    expenses[expenses]
    assets[assets + asset_cost_yearly + game_team_assets]
    employees[employees + compensation + game_team_employees]
    boms[boms + required_materials]
    lines[production_lines + capacity]
    po[purchase_order_yearly_total + monthly_distribution]
    folder[feasibility_programs + feasibility_projects]
  end

  game --> games
  game --> teams
  prem --> p1
  prem --> p2
  prem --> p3
  exp --> expenses
  ast --> assets
  emp --> employees
  bom --> boms
  cap --> lines
  dem --> po
```

| Plan field | Tables | How |
|---|---|---|
| `game.name / startYear / endYear` | `games` | `start_date` / `end_date` are year strings; `class_id` is the Feasibility class |
| *(per game)* | `game_teams` | one `"Default"` team, `capital = 0` |
| `premises.*` first finite + `game.periods` | `premises` | scalar snapshot of rates; `starting_money = 0` |
| `premises` policy % first finite | `premises_percentage` | inventory, suppliers, ST liability, cost %, sales, admin |
| `premises.yearly[]` | `premises_yearly`, `premises_percentage_yearly` | one row per year 2025–2035 |
| `premises.depreciationCategories[]` | `premises_deprecations`, `_yearly` | one category row + yearly rates |
| `expenses[]` (from CBM `services`) | `expenses` | `default_cost = monthlyAmount`, `expense_type = 'fixed'` |
| `assets[]` | `assets`, `asset_cost_yearly`, `game_team_assets` | Inversion categories + Capacidad machines (`category = 'machine'`); yearly cost only if nonzero; year = `2025 + index` |
| `employees[]` | `employees`, `employee_compensation_items`, `game_team_employees` | `job_title` stores category/type; `cantidad` empty → `1` |
| `bom` | `boms`, `required_materials` | product + parts |
| `capacity` | `production_lines`, `capacity` | one line `line-1`; `capacity.production_lines` is the **line id**, not the CBM count |
| `demand` | `purchase_order_yearly_total`, `purchase_order_monthly_distribution` | year-0 total + 12 month % |
| original `File` | R2 + `feasibility_projects.r2_key` | key `feasibility/{userId}/{programId}/{gameId}/{filename}` |
| program / project names | `feasibility_programs`, `feasibility_projects` | catalog only: `name`, `game_id`, `r2_key` — **no `cbm_json`** |

Not stored from the client CBM: `derivedBase`, monthly `demand.yearZeroOrders[]` (only total + shares), `demand.history`, `capacity.line.monthsWorkingWeeks`, machine `operators`.

Wrangler: `[createProgram] mapCbmToGamePlan flattened plan`, `[createProgram] CBM → D1 table map`, `[createProgram] persisted project`.

## Sequence

```mermaid
sequenceDiagram
  participant S as StagingContext
  participant API as POST /api/programs
  participant M as mapCbmToGamePlan
  participant DB as D1
  participant R2 as R2

  S->>S: { derivedBase, ...cbm } = project
  S->>API: name + projects JSON + files
  API->>API: session + Zod + file count
  API->>DB: INSERT feasibility_programs
  loop each project
    API->>M: mapCbmToGamePlan(cbm, name)
    M-->>API: write plan
    API->>DB: games, team, premises*, expenses, assets, employees, BOM, demand
    API->>R2: put original xlsx
    API->>DB: INSERT feasibility_projects (game_id, r2_key)
  end
  API-->>S: { id, name, projects: [{ id, name, gameId, r2Key }] }
  S->>S: invalidateQueries(['programs'])
```

## Where to look

| Step | File |
|------|------|
| Strip + POST | `src/sims/project-feasibility/staging/StagingContext.jsx` |
| Axios | `src/sims/project-feasibility/api/programs.api.js` |
| Route | `worker/src/routes/programs.route.js` |
| Controller | `worker/src/controllers/programs.controller.js` |
| Flatten | `worker/src/mappers/cbm-to-game.mapper.js` |
| Orchestrate | `worker/src/services/program.service.js` |
| INSERTs | `worker/src/models/project-write.model.js` |
| R2 key | `worker/src/services/r2.service.js` |
