# Diagramas de secuencia — mapeo RF → código actual

Referencia para diseñar test cases (Vitest, lado frontend). Cada bloque: qué RF cubre, en qué archivo(s)/función(es) vive HOY (no como se implementó originalmente), diagrama de secuencia en PlantUML (notación `actor`/`boundary`/`control`/`entity`/`database`), y notas de qué es testeable como función pura vs qué necesita React/Redux/red.

**Cancelados, sin código:** RF47 (Añadir venta), RF48 (Eliminar venta), RF49 (Modificar venta).

## Convención de estereotipos usada en todos los diagramas

| Estereotipo | Qué representa aquí | Ejemplos |
|---|---|---|
| `actor` | La persona usando la app | Usuario |
| `boundary` | Lo que toca el actor directamente, o el borde HTTP del worker (el punto donde algo externo entra al sistema) | componentes `.jsx`, `*.route.js` del worker |
| `control` | Orquestación/lógica de negocio — coordina, no es UI ni es el dato en sí | hooks (`use*.js`), Context (`StagingContext`), `*.controller.js`/`*.usecase.js`/`*.service.js` del worker |
| `entity` | Función pura de cálculo o estructura que representa datos del dominio | `costCalculations.js`, `financialEvaluation.js`, `outflowCalculations.js`, `*.model.js` del worker, reducers de `EditableTableSlice` |
| `database` | Almacenamiento real | D1, R2, `localStorage` |

---

## A. RF00 — Subir Programa de proyectos

Full-stack.

```plantuml
@startuml
actor Usuario as user
boundary "NewProgram.jsx\n(src/sims/project-feasibility/pages/)" as UI
control "StagingContext.jsx\naddFiles()" as Stage
entity "sheets.js\nparseNovusProjectFile()" as Parser
control "StagingContext.jsx\nconfirm()" as Confirm
control "programs.api.js\ncreateProgramRequest()" as ApiClient
boundary "programs.route.js\n(worker)" as Route
control "programs.controller.js\n(worker)" as Controller
control "programs.usecase.js\n(worker)" as Usecase
entity "project-write.model.js\n(worker)" as Model
database "D1 + R2" as DB

user -> UI : arrastra / selecciona .xlsx
UI -> Stage : addFiles(files)
Stage -> Stage : getFileGateError()\ngetProgramFileCountError()
Stage -> Parser : parseNovusProjectFile(file)
Parser --> Stage : {project (cbm), validation}
Stage -> Stage : setItems([...prev, accepted])
user -> UI : click "Confirm program"
UI -> Confirm : confirm()
Confirm -> ApiClient : createProgramRequest({name, projects, files})
ApiClient -> Route : multipart POST /api/programs
Route -> Controller : createProgramController(req)
Controller -> Usecase : createProgram(payload)
Usecase -> Model : insertProgram/insertProject/insertGame(...)
Model -> DB : INSERT feasibility_programs/projects, games, game_teams
Model -> DB : PUT object (R2)
DB --> Model : ids / object key
Model --> Usecase : createdProgram
Usecase --> Controller : createdProgram
Controller --> Route : 201 {createdProgram}
Route --> ApiClient : createdProgram
ApiClient --> Confirm : createdProgram
Confirm -> UI : navigate(program)
@enduml
```

**Testeable puro (sin DOM):** `getFileGateError`, `getProgramFileCountError`, `validateProgram` (gate/validation logic), y las funciones de `sheets.js` que arma `parseNovusProjectFile` (`readInversion`, `readPremisas`, `readCOs`, etc.) — dales un array-de-arrays simulando una hoja y afirma el `cbm` resultante.
**Necesita mocks:** `ApiClient` (red), todo lo del lado worker (fuera de alcance de Vitest frontend).

---

## B. RF42/RF43 — Tabla de gastos / Tabla de precios

Frontend-only, read-only render (no add/remove/edit — estas nunca tuvieron CRUD, son una fila fija por año).

```plantuml
@startuml
actor Usuario as user
boundary "Outflows.jsx" as OutUI
boundary "Income.jsx" as IncUI
control "useOutflows.js" as HookOut
control "useIncome.js" as HookInc
boundary "AdminExpensesTable.jsx\n(RF42)" as RF42
entity "CompetitivePriceTable.jsx\nbuildCompetitivePriceRows()\n(RF43)" as RF43
boundary "TableContainer.jsx" as Table

user -> OutUI : abre pestaña Outflows
OutUI -> HookOut : useOutflows(cbm)
HookOut --> OutUI : {years, expenses}
OutUI -> RF42 : <<render>> {years, expenses}
RF42 -> Table : columns + rows ("Administrative Expenses")

user -> IncUI : abre pestaña Inflows
IncUI -> HookInc : useIncome(project)
HookInc --> IncUI : {competitivaPrice, years, ...}
IncUI -> RF43 : buildCompetitivePriceRows(competitivaPrice, years)
RF43 --> IncUI : rows ("Competitive Price")
IncUI -> Table : <<render>> columns + rows
@enduml
```

**Testeable puro:** `buildCompetitivePriceRows(competitivaPrice, years)` — input array indexado por offset de año, output shape exacto. Mismo patrón para `buildProductionCostRows`, `buildSalesRows`, `buildUtilityCostRows` (todas en `src/components/sims/program/income/*.jsx`, exportadas como funciones `entity`-puras `rows = build*(data, years)`).

---

## C. RF44/45/46 — Estimación de ventas, edición, ventas netas

```plantuml
@startuml
actor Usuario as user
boundary "Income.jsx" as UI
control "useIncome.js" as Hook
entity "costCalculations.js\ncomputeNetSales()\n(RF46)" as RF46
entity "SalesTable.jsx\nbuildSalesRows()\n(RF44)" as RF44
boundary "TableContainer.jsx\n(solo lectura)" as Table

user -> UI : abre pestaña Inflows
UI -> Hook : useIncome(project)
Hook -> RF46 : computeNetSales(production)
RF46 --> Hook : netSales[year] = purchaseOrders[year] * salesPricePerUnit[year]
Hook -> RF44 : buildSalesRows({customerOrders, unitPrice, sales, years})
RF44 --> Hook : rows: Customer Orders, Unit Price, Total Income
Hook --> UI : rows
UI -> Table : <<render>>
note right of UI
  RF45 (editar la estimación): **no implementado**.
  SalesTable.jsx no está envuelto en EditableTable
  - no hay <<control>> de dispatch, no hay <<entity>> slice.
  No hay flujo que dibujar todavía.
end note
@enduml
```

**Testeable puro:** `computeNetSales(production)` (`src/utils/dashboard/costCalculations.js:114`) — verificar que coincide llamado desde `useIncome.js` (RF44/Inflows) Y desde `buildCostOfSales.js` (Income Statement) con el mismo input, ya que ambos caminos deben coincidir.

---

## D. RF50-53 — Crear/Añadir/Eliminar/Modificar tabla de costos

⚠️ UI deshabilitada (`EditableTable.jsx` → `ROWS_EDITABLE = false`), pero el pipeline Redux→API→D1 funciona si lo invocas directo (sin pasar por click).

```plantuml
@startuml
actor Usuario as user
boundary "CostOfSalesTable.jsx" as RF50
boundary "EditableTable.jsx\n(ROWS_EDITABLE = false ⚠️)" as EditUI
entity "EditableTableSlice.js\ncostTableEditsSlice\naddCustomRow / removeCustomRow /\nsetOverride / setCustomRowValue\n(RF51/52/53)" as Slice
control "useTableRowsSync.js" as Sync
control "rows.api.js\nreplaceTableRowsRequest()" as ApiClient
boundary "row-table.route.js\n(worker)" as Route
control "row-table.controller.js\n(worker)" as Controller
control "row-table.service.js\n(worker)" as Service
entity "row-table.model.js\n(worker)" as Model
database "D1 row_table" as DB

user -> RF50 : abre Cost Table
RF50 -> EditUI : <<render>> COST_ROWS
note right of EditUI
  click en IconButton add/remove/editar celda:
  **deshabilitado hoy** por ROWS_EDITABLE=false,
  pero el dispatch de abajo SÍ existe y es testeable
  invocándolo directo (sin pasar por el click).
end note
EditUI -> Slice : dispatch(addCustomRow / removeCustomRow /\nsetOverride / setCustomRowValue)
Slice -> Slice : reducer muta {overrides, customRows}
Slice --> Sync : customRows cambió
Sync -> Sync : debounce 800ms
Sync -> ApiClient : replaceTableRowsRequest(gameId, "costTableEdits", rows)
ApiClient -> Route : PUT /api/feasibility/:gameId/rows/costTableEdits
Route -> Controller : replaceRowsController(req)
Controller -> Service : replaceRows(gameId, tableKey, rows)
Service -> Model : deleteByTableKey() + insertMany()
Model -> DB : DELETE + INSERT
@enduml
```

**Testeable puro:** los reducers de `EditableTableSlice.js` directo (sin montar React) — `addCustomRow`, `removeCustomRow`, `setOverride`, `setCustomRowLabel`, `setCustomRowValue`, y `effectiveTotal(state, rows, getValue, year)`. Esto es Redux Toolkit puro (`entity`), perfecto para Vitest sin DOM.
**Necesita mocks:** `ApiClient` (red) si quieres probar el debounce/PUT.

---

## E. RF54/55/56 — Utilidad bruta / operación / antes de impuestos

```plantuml
@startuml
actor Usuario as user
boundary "ProfitSummaryTable.jsx" as UI
entity "costTableEditsSlice\neffectiveTotal()" as CostSlice
entity "operatingExpenseEditsSlice\neffectiveTotal()" as OpexSlice
entity "financialResultEditsSlice\neffectiveTotal()" as FinSlice
entity "costCalculations.js\ncomputeGrossProfit()\n(RF54)" as RF54
entity "costCalculations.js\ncomputeOperatingProfit()\n(RF55)" as RF55
entity "costCalculations.js\ncomputeIncomeBeforeTaxes()\n(RF56)" as RF56

user -> UI : abre Profit Summary
UI -> CostSlice : effectiveTotal(..., COST_ROWS, year)
CostSlice --> UI : totalCostOfSales
UI -> RF54 : computeGrossProfit(netSales, totalCostOfSales)
RF54 --> UI : grossProfit
UI -> OpexSlice : effectiveTotal(..., OPERATING_EXPENSE_ROWS, year)
OpexSlice --> UI : operatingExpenses
UI -> RF55 : computeOperatingProfit(grossProfit, operatingExpenses)
RF55 --> UI : operatingProfit
UI -> FinSlice : effectiveTotal(..., year)
FinSlice --> UI : financialExpenses, creditPayment, financialIncome
UI -> RF56 : computeIncomeBeforeTaxes(operatingProfit, financialExpenses, creditPayment, financialIncome)
RF56 --> UI : incomeBeforeTaxes
@enduml
```

**Testeable puro:** `computeGrossProfit`, `computeOperatingProfit`, `computeIncomeBeforeTaxes` (`src/utils/dashboard/costCalculations.js:249/395/503`) — funciones de aritmética simple (`entity`), casos límite: negativos, cero ventas, gastos mayores a ventas.
**Necesita Redux:** el "live recompute" en `ProfitSummaryTable.jsx` que lee los 3 slices — ahí sí monta un store de prueba o testeas `effectiveTotal` por separado (igual que en el bloque D).

---

## F. RF57/58 — Añadir/Eliminar impuesto

✅ Única excepción viva en la UI (no pasa por `ROWS_EDITABLE`).

```plantuml
@startuml
actor Usuario as user
boundary "ProfitSummaryTable.jsx\n(Total Taxes breakdown, líneas 291-311)" as UI
entity "taxesEditsSlice\naddCustomRow / removeCustomRow\n(RF57/58)" as Slice
control "useTableRowsSync.js\n(gameId, taxesEditsSlice, \"taxesEdits\")" as Sync
control "rows.api.js" as ApiClient
boundary "row-table.route.js\n(worker)" as Route
control "row-table.controller.js /\nrow-table.service.js\n(worker)" as Backend
database "D1 row_table" as DB
entity "costCalculations.js\ncomputeTaxes() / computeNetIncome()" as Calc

user -> UI : click + / 🗑 en fila de impuesto
UI -> Slice : dispatch(addCustomRow / removeCustomRow)
Slice --> Sync : customRows cambió
Sync -> ApiClient : replaceTableRowsRequest(gameId, "taxesEdits", rows)
ApiClient -> Route : PUT .../rows/taxesEdits
Route -> Backend : replaceRowsController → replaceRows
Backend -> DB : persist
UI -> Calc : computeTaxes() / computeNetIncome() (ISR/PTU)
Calc --> UI : taxes, netIncome
@enduml
```

**Testeable puro:** `computeTaxes`, `computeNetIncome` (`costCalculations.js:517-543`), más los reducers del `taxesEditsSlice` igual que bloque D.

---

## G. RF63/64 — Tabla de flujo de efectivo / Tabla de salidas

```plantuml
@startuml
actor Usuario as user
boundary "CashTable.jsx\n(RF63)" as RF63UI
boundary "OutflowsTable.jsx\n(RF64)" as RF64UI
entity "cashFlowCalculations.js\ncomputeCashBalanceByYear()" as RF63Calc
entity "outflowCalculations.js\nbuildOutflowRows()" as BuildRows
entity "outflowCalculations.js\ngetExtraAssetCategories()" as ExtraCat
entity "outflowCalculations.js\ncomputeCapexByYear()" as Capex
entity "outflowCalculations.js\noutflowBaseValue()" as BaseValue

user -> RF63UI : abre Cash Table
RF63UI -> RF63Calc : computeCashBalanceByYear(cbm)
RF63Calc --> RF63UI : saldoInicialByYear, endingBalanceByYear

user -> RF64UI : abre Outflows
RF64UI -> BuildRows : buildOutflowRows(cbm)
BuildRows -> ExtraCat : getExtraAssetCategories(cbm)
ExtraCat --> BuildRows : categorías no reconocidas\n(cada una, su propia fila dinámica)
BuildRows --> RF64UI : filas fijas + filas extra
RF64UI -> Capex : computeCapexByYear(cbm, years)
Capex --> RF64UI : capexByYear
RF64UI -> BaseValue : outflowBaseValue(rowKey, year, rowByYear, capexByYear)\n(una vez por celda)
BaseValue --> RF64UI : valor de la celda
@enduml
```

**Testeable puro:** `computeCashBalanceByYear`, `buildOutflowRows`, `getExtraAssetCategories`, `computeCapexByYear`, `outflowBaseValue` — todas `entity` puras en `src/sims/project-feasibility/costTable/{cashFlowCalculations,outflowCalculations}.js`, cero dependencia de React. Casos clave ya conocidos de esta sesión: doble conteo de maquinaria, exclusión de categorías conocidas.

---

## H. RF65/66/67 — TREMA / TIR / Decisión

Las 3 son funciones puras en `src/utils/dashboard/financialEvaluation.js`, literalmente comentadas con su RF.

```plantuml
@startuml
actor Usuario as user
boundary "ProjectEvaluationSummary.jsx" as UI
entity "financialEvaluation.js\ncomputeTrema()\n(RF65)" as RF65
entity "financialEvaluation.js\ncomputeNPV()\n(RF66)" as NPV
entity "financialEvaluation.js\ncomputeIRR()\n(RF66)" as IRR
entity "financialEvaluation.js\ndecideProject()\n(RF67)" as RF67

user -> UI : abre pestaña Cash Flows / ajusta Market Rate, Inflation, Risk Premium
UI -> RF65 : computeTrema(marketRate, inflation, riskPremium)
RF65 --> UI : trema
UI -> NPV : computeNPV(netCashFlowByYear, trema)
NPV --> UI : npv
UI -> IRR : computeIRR(netCashFlowByYear)
IRR --> UI : irr (o null si no hay cambio de signo)
UI -> RF67 : decideProject(npv, irr, trema)
RF67 --> UI : {accepted, reason}
@enduml
```

**Testeable puro, prioridad alta:** `computeTrema`, `computeNPV`, `computeIRR` (bisección, probar: serie sin cambio de signo → `null`; serie con VAN negativo en todo el rango; convergencia con tolerancia), `decideProject` (3 casos: IRR null, npv>0&&irr>trema, lo contrario).
⚠️ Nota de `CALCULOS_Y_MONEDA.md`: la serie que hoy alimenta a estas funciones (`endingBalanceByYear`, saldo acumulado) no es la que el Excel de referencia usa (Flujo Neto del periodo) — bug conocido sin arreglar. Vale la pena escribir el test ANTES del fix fijando el comportamiento actual, o directo con el valor esperado del Excel si van a arreglarlo ya.

---

## I. RF68 — Gráfica de flujo neto de efectivo

```plantuml
@startuml
actor Usuario as user
boundary "NetFlowGraph.jsx" as UI
control "useFlow.js\nuseCashFlow()" as Hook
entity "NetFlowGraph.jsx\ncalcTrendline()\n(regresión lineal)" as Trend
boundary "Highcharts\n(HighchartsReact)" as Chart

user -> UI : abre pestaña Cash Flows
UI -> Hook : useCashFlow(project)
Hook --> UI : netFlow {year: value}
UI -> UI : years = Object.keys(netFlow).sort()\nvalues = years.map(y => netFlow[y] / 1e6)
UI -> Trend : calcTrendline(values)
Trend --> UI : línea de tendencia (slope, intercept)
UI -> Chart : <<render>> options (column + line series)
@enduml
```

**Testeable puro:** `calcTrendline(values)` (`entity`, regresión lineal simple, está en el mismo archivo) — dale una serie conocida y verifica slope/intercept. El render de Highcharts no es útil probarlo en Vitest (sería snapshot frágil).

---

## J. RF69-74 — Balance General (Activos circulantes, Fijo, Diferido, Pasivo circulante, Pasivo LP, Capital, Razones)

Un solo diagrama porque todos comparten el mismo `control` central.

```plantuml
@startuml
actor Usuario as user
boundary "Balance.jsx\n(RF69)" as BalanceUI
boundary "DeferedActives.jsx\n(RF70)" as DeferedUI
boundary "Passive.jsx\n(RF71/72)" as PassiveUI
boundary "Equity.jsx\n(RF73)" as EquityUI
boundary "FinancialRatios.jsx\n(RF74)" as RatiosUI
control "useEffectiveBalanceTotals.js" as Totals
entity "computeActives.js /\ncomputeCurrentActives.js" as Actives
entity "computeFixedAssets.js\nresolveMachineryAssets()" as Fixed
entity "computePassives.js" as Passives

user -> BalanceUI : abre pestaña Balance Sheet
BalanceUI -> Totals : useEffectiveBalanceTotals(cbm, gameId)
Totals -> Actives : computeActives(cbm)
Actives --> Totals : currentActivesTotal, fixedAssetsNetValue
Totals -> Passives : computePassives(cbm)
Passives --> Totals : currentPassivesTotal, longTermPassivesTotal
Totals --> BalanceUI : {totalActives, totalPassives, inventory,\nnetSales, netIncome, ...}
BalanceUI -> Fixed : computeFixedAssetsByCategory(cbm, years)
Fixed --> BalanceUI : filas por categoría + depreciación
BalanceUI -> DeferedUI : <<render>> DEFERED_ACTIVES_ROWS\n(Seguros, Pago de Seguros - fijos en $0)
BalanceUI -> PassiveUI : <<render>> currentPassives + longTermPassives

user -> EquityUI : abre Shareholder's Equity
EquityUI -> Totals : totalsByYear[year]
Totals --> EquityUI : totalActives, totalPassives, netIncome
EquityUI -> EquityUI : legacy = totalActives - totalPassives\n- periodUtility - acumUtility

user -> RatiosUI : abre pestaña Ratios
RatiosUI -> Totals : totalsByYear[year]
Totals --> RatiosUI : totales
RatiosUI -> RatiosUI : 8x RATIO_DEFINITIONS.compute(totals)\n(safeDivide)
@enduml
```

**Testeable puro:** `computeActives`, `computeCurrentActives` (ojo: `stocks`/`inventary`/`deposits` son **mock hardcodeado**, no leen del cbm — documentar eso en el test, no esperar que cambie con el Excel), `computeFixedAssets.js` (`resolveMachineryAssets`, `rateFieldForCategory`), `computePassives.js`. Los 8 `RATIO_DEFINITIONS.compute` de `FinancialRatios.jsx` son funciones `entity` puras `(totals) => number` — tabla perfecta para tests parametrizados (un caso por ratio × signo del denominador: positivo, negativo, cero→NaN→"—").
**Necesita Redux:** `useEffectiveBalanceTotals` (`control`) lee 4 slices (`currentActivesSlice`, `deferedActivesSlice`, `currentPassiveSlice`, `longTermPassiveSlice`) — para testear el hook completo monta un store de prueba con overrides/customRows conocidos.

---

## K. R76/RF76 — Iniciar sesión

Full-stack, dos sistemas de sesión en paralelo (JWT propio + Clerk).

```plantuml
@startuml
actor Usuario as user
boundary "Login.jsx\n(SignInForm)" as UI
control "auth.api.js\nloginRequest()" as ApiClient
boundary "auth.route.js\n(worker)" as Route
control "auth.controller.js\nloginController()\n(worker)" as Controller
control "auth.usecase.js\nloginUseCase()\n(worker)" as Usecase
control "auth.service.js\nlogin()\n(worker)" as Service
entity "password.service.js\n(worker)" as PwService
database "D1 (users)" as DB
control "session.service.js\nbuildAuthSession()\n(worker)" as SessionService
control "clerk-auth.service.js\ncreateClerkSignInTicket()\n(worker)" as ClerkBE
control "useCompleteAuth.js" as Complete
boundary "@clerk/react\nuseSignIn()" as ClerkFE
entity "AuthContext.jsx\nlogin()" as Ctx
database "localStorage" as LocalStorage

user -> UI : submit email + password
UI -> ApiClient : loginRequest(email, password)
ApiClient -> Route : POST /api/auth/login
Route -> Controller : loginController(req)
Controller -> Usecase : loginUseCase(credentials)
Usecase -> Service : login(email, password)
Service -> DB : findUserByEmail(email)
DB --> Service : user row
Service -> PwService : verify(password, hash)
PwService --> Service : ok
Service -> SessionService : buildAuthSession(user)
SessionService -> ClerkBE : createClerkSignInTicket(clerk_user_id)
ClerkBE --> SessionService : clerkTicket
SessionService -> SessionService : createSessionToken(user) (JWT, 7d)
SessionService --> Service : {token, clerkTicket}
Service --> Usecase : {user, token, clerkTicket}
Usecase --> Controller : {user, token, clerkTicket}
Controller -> Controller : setSessionCookie(token) (httpOnly)
Controller --> Route : 200 {user, clerkTicket}
Route --> ApiClient : {user, clerkTicket}
ApiClient --> UI : {user, clerkTicket}
UI -> Complete : useCompleteAuth({user, clerkTicket})
Complete -> ClerkFE : signIn.create({strategy:"ticket", ticket})
ClerkFE -> ClerkFE : setActive({session})
Complete -> Ctx : login(user)
Ctx -> LocalStorage : tecbooks_user = user
Complete -> UI : navigate(/sims/project-feasibility)
@enduml
```

**Fuera de alcance de Vitest frontend puro:** casi todo este flujo depende de red (worker) y de Clerk SDK — candidato a mock pesado (`vi.mock` de `auth.api.js` y `@clerk/react`) más que unit test real. Lo único puramente testeable sin mocks: validación de formulario en `Login.jsx` si la tiene (revisar), y el reducer `entity` de `AuthContext.jsx` (`login`/`logout`, lectura/escritura de `localStorage`).
**Nota de seguridad:** `session.middleware.js` solo debe disparar logout en código `session_invalid`, nunca en 401 genérico — ya hay un test implícito ahí (`isSessionInvalidError` en `worker.util.js`), vale la pena un test explícito de esa función con los 2 casos (401 con código vs 401 sin código).
