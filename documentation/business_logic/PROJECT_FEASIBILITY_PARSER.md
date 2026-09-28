# Lector y motor de cálculo — Project Feasibility

Documenta dos cosas: **Parte 1** — el "lector" de proyectos, el código que
convierte un workbook `.xlsx` (formato InputNovus) en el objeto
`ProjectClass` (`cbm`). **Parte 2** — el motor de cálculo, el código que
toma ese `cbm` y produce todos los números que ven las tablas (Income
Statement, Cash Flow, Balance Sheet, Ratios, TREMA/TIR/VNA, Break-even).

# Parte 1 — Lector (parser de Excel)

Vive casi todo en `src/sims/project-feasibility/parse/`.

```
parse/
├── fileGates.js          # valida el archivo antes de tocarlo
├── cells.js               # helpers de lectura de celda/fila compartidos
├── sheets.js               # una función read*() por hoja del Excel
└── parseNovusProject.js  # orquesta todo lo anterior
```

## 1. Flujo general

```
archivo (File) 
  → getFileGateError()            (fileGates.js)
  → file.arrayBuffer()
  → parseNovusProject(buffer)      (parseNovusProject.js)
      → XLSX.read()                 (librería xlsx)
      → createProjectClass()        (model/, objeto vacío)
      → readPremisas / readCOs / readCapacidad / readBOM /
        readInversion / readEmpleados / readServicios   (sheets.js)
      → applyDerivedBase()          (model/, calcula derivados)
      → validateProjectClass()      (model/, errores/warnings)
  → { project, validation }
```

Entrada pública (usada por la UI de staging,
`src/sims/project-feasibility/staging/StagingContext.jsx`):

```js
// parseNovusProject.js
export async function parseNovusProjectFile(file) {
  const gate = getFileGateError(file)
  if (gate) {
    return { project: null, validation: { valid: false, errors: [gate], warnings: [] } }
  }
  const buffer = await file.arrayBuffer()
  return parseNovusProject(buffer, { fileName: file.name })
}
```

`parseNovusProject(input, { fileName })` también se puede llamar directo con
un `ArrayBuffer`/`Uint8Array`/workbook ya leído (usado en tests/scripts).

## 2. Gate de archivo — `fileGates.js`

Corre **antes** de intentar parsear nada (ni siquiera abre el workbook si
falla):

```js
export function getFileGateError(file) {
  if (!file) return 'No file'
  const ext = extensionOf(file.name)
  if (!ALLOWED_EXTENSIONS.includes(ext)) return 'Only .xlsx or .xls files are allowed'
  if (typeof file.size === 'number' && file.size > MAX_FILE_BYTES) return 'File exceeds 5MB'
  return null
}
```

`ALLOWED_EXTENSIONS`, `MAX_FILE_BYTES` (5MB), `MAX_PROJECTS_PER_PROGRAM` viven
en `constants.js`. `getProgramFileCountError(files)` valida el número de
proyectos por programa (1 a `MAX_PROJECTS_PER_PROGRAM`), se usa al armar el
programa completo, no por archivo individual.

## 3. Hojas requeridas y lectura cruda

`parseNovusProject.js` primero valida que el workbook tenga las 7 hojas de
`REQUIRED_SHEETS` (`constants.js`): `Premisas, COs, Capacidad, BOM, Inversion,
Empleados_2, Servicios`. Si falta alguna, regresa `project: null` con el error
`Missing sheet "X"` sin leer nada más.

Cada hoja se convierte a un arreglo de arreglos (fila → columna, sin headers
con nombre) antes de pasarla a su `read*`:

```js
function toRows(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName]
  if (!sheet) return []
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: undefined, raw: true })
}
```

`header: 1` → cada fila es un array posicional (`row[0]`, `row[1]`, ...), no
un objeto por nombre de columna. Por eso todo el parser lee por índice de
columna, no por nombre.

## 4. Helpers compartidos — `cells.js`

Todas las operaciones de lectura pasan por estas piezas:

| Función | Qué hace |
|---|---|
| `normalizeLabel(value)` | minúsculas, sin acentos, sin puntos, espacios colapsados — para comparar labels de fila de forma tolerante a variaciones del Excel |
| `isBlank(value)` | `undefined`/`null`/string vacío |
| `toNumberOrUndefined(value)` | celda → número o `undefined`. `"-"` → `undefined` (no capturado aún) |
| `toNumberDashAsZero(value)` | igual, pero `"-"` → `0` (usado solo en COs, donde "-" significa "mes que ya pasó sin orden", no "sin dato") |
| `toStringOrUndefined(value)` | celda → string recortado o `undefined` |
| `yearColumnMap(headerRow)` | escanea una fila y regresa `{ [año]: índiceDeColumna }` para cada celda que sea un año dentro de `HORIZON_YEARS` (2025-2035) |
| `seriesFromRow(row, colMap)` | usa el `colMap` de arriba para armar un array de 11 posiciones (una por año de `HORIZON_YEARS`), leyendo la columna correcta por año |
| `emptyYearSeries()` | array de 11 `undefined` — shape default de cualquier campo por año |

```js
export function yearColumnMap(headerRow) {
  const map = {}
  headerRow.forEach((cell, index) => {
    const year = Number(cell)
    if (HORIZON_YEARS.includes(year)) map[year] = index
  })
  return map
}

export function seriesFromRow(row, colMap) {
  return HORIZON_YEARS.map((year) => {
    if (!(year in colMap)) return undefined
    return toNumberOrUndefined(row?.[colMap[year]])
  })
}
```

⚠️ **Riesgo conocido de `yearColumnMap`**: si una fila header tiene el mismo
año repetido en dos columnas distintas (dos secciones distintas comparten
fila), `forEach` se queda con la ÚLTIMA columna que matchea ese año — pisa la
primera silenciosamente. Pasó exactamente esto en `readCapacidad` (ver
sección 6.3) porque Capacidad tiene "2025" en la columna de parámetros de
línea Y en la columna de costo de máquinas, en la misma fila. Cualquier hoja
nueva con esa misma forma (dos secciones, un solo header row) pisará datos
igual si se le pasa `seriesFromRow` con el `yearColumnMap` completo de la
fila — hay que leer esa sección por columna fija, no por año.

## 5. Orquestación — `parseNovusProject.js`

```js
const project = createProjectClass({ fileName })
readPremisas(toRows(workbook, 'Premisas'), project)
readCOs(toRows(workbook, 'COs'), project)
readCapacidad(toRows(workbook, 'Capacidad'), project)
readBOM(toRows(workbook, 'BOM'), project)
readInversion(toRows(workbook, 'Inversion'), project)
readEmpleados(toRows(workbook, 'Empleados_2'), project)
readServicios(toRows(workbook, 'Servicios'), project)

project.metadata.name = project.bom.productName || ''
applyDerivedBase(project)              // calcula campos derivados (ver model/applyDerivedBase.js)
const validation = validateProjectClass(project)  // errores/warnings (ver model/validateProjectClass.js)
```

Cada `read*` **muta `project` in place** (no regresa nada) — reciben las
filas crudas de su hoja y el objeto `project` (creado por `createProjectClass`,
que ya tiene el shape completo con defaults/`emptyYearSeries()`).

## 6. Las 7 operaciones de lectura (una por hoja)

### 6.1 `readPremisas(rows, project)` — hoja **Premisas**

Llena `project.premises.*` y `project.timeline.financingPeriods`. Es la hoja
con más variedad de shapes: filas de tasa fija (`PREMISES_ROWS`), una fila
escalar (`Periodos`, `Demanda anual`), y un bloque dinámico de depreciación
por categoría.

```js
const PREMISES_ROWS = {
  'tipo de cambio al cierre (dolares)': 'fxClose',
  'tasa lider nacional': 'nationalLeadingRate',
  cpp: 'cpp', cetes: 'cetes', libor: 'libor',
  'inflacion nacional': 'nationalInflation',
  'tasa isr': 'isr', 'tasa impac': 'impac', 'tasa de ptu': 'ptu',
  'inflacion extranjera': 'foreignInflation',
  'porcentaje de inventario': 'inventoryPct',
  'porcentaje de proveedores': 'suppliersPct',
  'porcentaje de pasivo corto plazo': 'shortTermLiabilityPct',
  'porcentaje de costo directo del producto': 'directProductCostPct',
  'porcentaje de costo indirecto del producto': 'indirectProductCostPct',
  'porcentaje de gasto de venta': 'salesExpensePct',
  'porcentaje de administracion': 'adminPct',
  'porcentaje depreciacion edificios': 'depreciationBuildings',
  'porcentaje depreciacion maquinaria y equipo': 'depreciationMachinery',
  'porcentaje depreciacion equipo de transporte': 'depreciationTransport',
  'porcentaje depreciacion equipo de computo': 'depreciationCompute',
}
```

Cada label matcheado con `PREMISES_ROWS` se lee como serie por año
(`seriesFromRow(row, lastYearMap)`) — `lastYearMap` se actualiza cada vez que
una fila SIN label (o con label) trae años en sus propias celdas.

Casos especiales dentro del mismo loop:
- `"periodos"` → escalar, `project.timeline.financingPeriods = toNumberOrUndefined(row[1])`.
- `"demanda anual"` → escalar, `project.premises.demandGrowth = toNumberOrUndefined(row[1])`. Tasa de crecimiento que usa `projectPurchaseOrders` para proyectar Customer Orders después del año cero (ver `costTable/cbmToCostTableInputs.js`).
- Cualquier label que matchee `/^porcentaje (?:de )?depreciacion (.+)$/` y NO sea una de las 4 categorías fijas → `project.premises.depreciationByCategory[categoría]`, genérico (una categoría que el Excel invente, ej. "Animales").
- Bloque "categoría luego item": si esa fila de depreciación además tiene años en sus propias celdas (es un header, no un valor), las filas siguientes sin match se leen como la tasa de ITEMS individuales dentro de esa categoría (`insideDepreciationItemBlock`).
- Al final, si `startingMoney` no se llenó por ninguna fila con label reconocido, se lee directo de una posición fija: `rows[32]?.[1]` (Premisas!B33, "Saldo inicial").

### 6.2 `readCOs(rows, project)` — hoja **COs**

Llena `project.demand.*`: `monthShares[12]`, `yearZeroOrders[12]`, `history[]`,
`yearZeroYear`, `yearZeroTotal`.

```js
for (let i = 1; i < rows.length; i += 1) {
  const row = rows[i]
  const month = toStringOrUndefined(row?.[0])
  if (normalizeLabel(month) === 'total') break
  const monthIndex = MONTHS.findIndex((name) => normalizeLabel(name) === normalizeLabel(month))
  if (monthIndex >= 0) {
    project.demand.monthShares[monthIndex] = toNumberOrUndefined(row[1])
    project.demand.yearZeroOrders[monthIndex] = toNumberDashAsZero(row[2])
  }
  const histYear = toNumberOrUndefined(row[4])
  const histTotal = toNumberOrUndefined(row[5])
  if (histYear !== undefined && histTotal !== undefined) history.push({ year: histYear, total: histTotal })
}
project.demand.yearZeroYear = toNumberOrUndefined(rows[1]?.[7])   // columna H
project.demand.yearZeroTotal = toNumberOrUndefined(rows[1]?.[8])  // columna I
```

Nota: `yearZeroOrders` usa `toNumberDashAsZero` (no `toNumberOrUndefined`) —
en esta hoja "-" significa "mes que todavía no pasó" y se trata como 0 real
dentro de la ventana YTD, no como dato faltante.

### 6.3 `readCapacidad(rows, project)` — hoja **Capacidad**

Llena `project.capacity.line.*` (8 parámetros escalares de la línea de
producción) y `project.capacity.machines[]` (lista de máquinas con su costo
de adquisición por año).

```js
const LINE_LABELS = {
  'quality yield': 'qualityYield', 'seconds x unit': 'secondsPerUnit',
  'hours shift': 'hoursShift', shifts: 'shifts',
  'production lines': 'productionLines', 'week working days': 'weekWorkingDays',
  'months working weeks': 'monthsWorkingWeeks', 'year working months': 'yearWorkingMonths',
}

for (const row of rows.slice(1)) {
  const label = normalizeLabel(row?.[0])
  if (label && !SKIP_LINE_LABELS.has(label) && LINE_LABELS[label]) {
    // Parámetros de línea = ESCALARES (columna A=label, B=valor). NO usar el
    // yearMap del header - esa fila tiene "2025" repetido en dos columnas
    // distintas (params vs costo de máquina) y el yearMap se queda con la
    // última, leyendo la sección equivocada.
    const value = toNumberOrUndefined(row?.[1])
    project.capacity.line[LINE_LABELS[label]] = HORIZON_YEARS.map(() => value)
  }

  const code = toStringOrUndefined(row?.[3])
  if (!code || normalizeLabel(code).startsWith('agregar')) continue
  project.capacity.machines.push({
    code,
    description: toStringOrUndefined(row[4]),
    processSeconds: toNumberOrUndefined(row[5]),
    operators: toNumberOrUndefined(row[6]),
    cycleTime: toNumberOrUndefined(row[7]),
    acquisitionByYear: seriesFromRow(row, yearMap),   // esta parte SÍ usa el yearMap del header
  })
}
```

`SKIP_LINE_LABELS` (`units x hour`, `anual capacity`) son filas calculadas por
el propio Excel (no insumos) — se ignoran, `applyDerivedBase.js` las
recalcula (`capacityForIndex`).

### 6.4 `readBOM(rows, project)` — hoja **BOM**

Llena `project.bom.productName`, `project.bom.salePrice`,
`project.bom.parts[]` (lista de materiales: `id`, `description`, `quantity`,
`cost`).

```js
project.bom.productName = toStringOrUndefined(rows[0]?.[1]) ?? ''
const header = rows[1] ?? []
const salePriceCol = header.findIndex((cell) => normalizeLabel(cell) === 'costo de venta')
project.bom.salePrice = toNumberOrUndefined(rows[1]?.[salePriceCol >= 0 ? salePriceCol + 1 : 8])

for (const row of rows.slice(2)) {
  const id = toStringOrUndefined(row?.[0])
  const description = toStringOrUndefined(row?.[1])
  if (!id && !description) {
    if (project.bom.parts.length) break   // fila vacía DESPUÉS de la lista = fin
    continue                              // fila vacía ANTES = todavía no llegamos
  }
  project.bom.parts.push({ id: id ?? '', description: description ?? '', quantity: toNumberOrUndefined(row[2]), cost: toNumberOrUndefined(row[3]) })
}
```

Busca la columna "Costo de venta" por nombre (tolerante a que se mueva de
posición); si no la encuentra, cae a la columna I (índice 8) como default.

### 6.5 `readInversion(rows, project)` — hoja **Inversion**

Llena `project.assets.byCategory` (genérico, cualquier categoría que el
Excel tenga) y además alias legacy `project.assets.{transport,buildings,compute}`
para las 3 categorías fijas que el resto del pipeline espera por nombre.

Detecta categorías **estructuralmente**: una fila es "header de categoría" si
sus propias celdas son años (2025, 2026...), no montos. Así cualquier
categoría que el Excel invente (ej. "Animales") se captura igual.

```js
for (const row of rows) {
  const rowYearMap = yearColumnMap(row)
  if (Object.keys(rowYearMap).length > 0) {          // esta fila ES un header de categoría
    currentCategory = toStringOrUndefined(row?.[0])
    yearMap = rowYearMap
    const label = normalizeLabel(row?.[0])
    isMachineryCategory = MACHINERY_CATEGORY_PATTERN.test(label)   // /^maquinaria|^machinery/
    if (currentCategory && !isMachineryCategory) project.assets.byCategory[currentCategory] ??= []
    const block = ASSET_BLOCKS.find((item) => label.startsWith(item.match))  // transport/buildings/compute
    currentKey = block?.key ?? null
    continue
  }
  if (!currentCategory) continue
  const name = toStringOrUndefined(row?.[0])
  if (!name) {                                        // fila en blanco = fin de la categoría
    if (isBlank(row?.[1])) { currentKey = null; currentCategory = null; isMachineryCategory = false }
    continue
  }
  if (isMachineryCategory) continue                    // ver nota abajo

  const asset = { name, acquisitionByYear: seriesFromRow(row, yearMap) }
  project.assets.byCategory[currentCategory].push(asset)
  if (currentKey) project.assets[currentKey].push(asset)
}
```

**Nota (maquinaria)**: si Inversion tiene su propia categoría "Maquinaria y
equipo", se ignora por completo aquí — `capacity.machines` (leído en
`readCapacidad`, sección 6.3) ya es la única fuente de verdad para maquinaria
en toda la app (Cash Outflows, préstamo, depreciación del Balance Sheet). Sin
este filtro, la misma maquinaria se contaba dos veces.

### 6.6 `readEmpleados(rows, project)` — hoja **Empleados_2**

Llena `project.employees[]`. Header tabular normal (busca cada columna por
nombre normalizado, con fallback a posición fija si no la encuentra):

```js
const EMPLOYEE_HEADER = {
  nombre: 'name', tipo: 'type', percepcion: 'percepcion', imss: 'imss',
  infonavit: 'infonavit', 'vales de despensa': 'valesDespensa',
  'prima vacacional': 'primaVacacional', aguinaldo: 'aguinaldo',
  'fondo de ahorro': 'fondoAhorro', comedor: 'comedor', isr: 'isr', cantidad: 'cantidad',
}
```

Para de leer en la primera fila sin nombre (`if (!name) break`) — asume que
no hay huecos en medio de la lista de empleados.

### 6.7 `readServicios(rows, project)` — hoja **Servicios**

Llena `project.services[]` (`category`, `subcategory`, `description`,
`monthlyAmount`, `notes`). `category` se "arrastra" de la última fila que sí
la tenía (las filas siguientes de la misma categoría la dejan en blanco en el
Excel):

```js
let category
for (const row of rows.slice(1)) {
  const subcategory = toStringOrUndefined(row?.[1])
  const description = toStringOrUndefined(row?.[2])
  if (!subcategory && !description) {
    if (project.services.length) break
    continue
  }
  const nextCategory = toStringOrUndefined(row?.[0])
  if (nextCategory) category = nextCategory
  if (SKIP_SERVICES_SUBCATEGORY.test(subcategory ?? '')) continue   // filtra "Sueldos y salarios" (ya vienen de Empleados_2)
  project.services.push({ category: category ?? '', subcategory: subcategory ?? '', description: description ?? '', monthlyAmount: toNumberOrUndefined(row[3]), notes: toStringOrUndefined(row[4]) ?? '' })
}
```

## 7. Después de leer: derivar y validar

No son parte del "lector" en sí, pero corren inmediatamente después dentro
de `parseNovusProject`:

- **`applyDerivedBase(project)`** (`model/applyDerivedBase.js`) — calcula
  campos que ninguna hoja trae directo: `derivedBase.unitsPerHour`,
  `annualCapacity`/`annualCapacityByYear` (fórmula de Capacidad), conteo de
  operadores/supervisores, costo de BOM, y clasifica cada empleado en
  categoría (`direct`/`indirect`/`engineering`/`administrative`) por su
  nombre/tipo.
- **`validateProjectClass(project)`** (`model/validateProjectClass.js`) —
  reglas de sanidad (números finitos, rangos razonables de tasas, etc.),
  regresa `{ valid, errors, warnings }`. No muta `project`.

## 8. Resumen — hoja → función → campos

| Hoja Excel | Función | Escribe en `project.*` |
|---|---|---|
| Premisas | `readPremisas` | `premises.*` (tasas por año, `demandGrowth`, `startingMoney`, `depreciationByCategory`), `timeline.financingPeriods` |
| COs | `readCOs` | `demand.monthShares`, `demand.yearZeroOrders`, `demand.history`, `demand.yearZeroYear`, `demand.yearZeroTotal` |
| Capacidad | `readCapacidad` | `capacity.line.*` (8 params escalares), `capacity.machines[]` |
| BOM | `readBOM` | `bom.productName`, `bom.salePrice`, `bom.parts[]` |
| Inversion | `readInversion` | `assets.byCategory`, alias `assets.{transport,buildings,compute}` |
| Empleados_2 | `readEmpleados` | `employees[]` |
| Servicios | `readServicios` | `services[]` |

Todas comparten los mismos helpers de `cells.js` (sección 4) y el mismo
`toRows()` (`XLSX.utils.sheet_to_json(sheet, { header: 1, ... })`) — ninguna
lee el Excel por su cuenta.

# Parte 2 — Motor de cálculo

Toma el `cbm` (ya sea recién parseado, o reconstruido desde D1 vía
`getFeasibilityModel`) y produce cada tabla. La mayoría de las fórmulas
puras viven en **`src/utils/dashboard/costCalculations.js`** (518 líneas, "el
motor de fórmulas" según `.agents/patterns.md`); cada pantalla tiene su
propio archivo "build\*"/"compute\*" en `src/sims/project-feasibility/` que
las orquesta con los datos reales del proyecto.

## 9. Diagrama general

```
cbm
 └─ applyDerivedBase(project)        (ya corrió en el parser, sección 7)
      → derivedBase: unitsPerHour, annualCapacity/annualCapacityByYear,
        operatorCount, supervisorCount, bomMaterialCost, employees clasificados

 └─ cbmToCostTableInputs(cbm)         (costTable/cbmToCostTableInputs.js)
      → { employees, production: {purchaseOrders, qualityYield,
          materialCostPerUnit, salesPricePerUnit}, premises }
      ├─ purchaseOrders  ← projectPurchaseOrders()   (demand/projectPurchaseOrders.js)
      ├─ qualityYield    ← projectQualityYield()      (capacity.line.qualityYield por año)
      └─ salesPricePerUnit ← projectSalesPrice()      (BOM.salePrice compuesto por inflación)

 └─ buildCostOfSales(cbm)             (costTable/buildCostOfSales.js)
      → costOfSalesByYear[]  (Income Statement completo, 22 campos por año)
      usa: costCalculations.js (computeRawMaterialCost, sumSalariesByCategoryPerYear,
           computeNetSales, computeIndirectMaterialCosts, computeGrossProfit,
           computeAdminExpenses, computeOperatingExpenses, computeOperatingProfit,
           computeFinancingAmount, computeAmortizationSchedule,
           computeIncomeBeforeTaxes, computeTaxes, computeNetIncome)
      + computeFixedAssetsByCategory  (balance/computeFixedAssets.js, depreciación)
      + computeCumulativeInvestment   (investment/machineryInvestment)

 └─ outflowCalculations.js           (Cash Outflows - reusa costOfSalesByYear + capex)
 └─ cashFlowCalculations.js          (Cash Inflows - Entradas - Salidas, saldo encadenado)
 └─ computeProductionCosts.js        (Unit Costs / Income tab - motor PARALELO, ver 13)
 └─ balance/*.js                     (Balance Sheet - Actives/Passives/Equity)
 └─ FinancialRatios.jsx              (Ratios - lee balance.js totals)
 └─ financialEvaluation.js           (TREMA/TIR/VNA)
 └─ BreakEvenSummary.jsx             (Break-even, año 0 solamente)
```

## 10. Income Statement — `buildCostOfSales(cbm)`

`src/sims/project-feasibility/costTable/buildCostOfSales.js`. Función central:
la usan Cost Table, Profit Summary, Cash Outflows, Ratios, TREMA/TIR/VNA y
Break-even — un solo cálculo, no uno por pantalla.

**Insumos por año** (vía `cbmToCostTableInputs(cbm)` + `cbmToOperatingExpenseInputs(cbm, years)`):

```js
const { employees, production, premises } = cbmToCostTableInputs(cbm)
const opex = cbmToOperatingExpenseInputs(cbm, years)   // assets, machines, adminPct, salesExpensePct, tasas
```

**Cadena de fórmulas** (`costCalculations.js`, todas por año):

| Campo | Fórmula | Función |
|---|---|---|
| `rawMaterial` (MP) | `workOrders = CO / qualityYield`; `MP = workOrders * materialCostPerUnit` | `computeRawMaterialCost` |
| `directLabour`/`indirectManufacturing`/`engineeringSalaries` | salario anual (12×mensual×headcount) × inflación por año | `sumSalariesByCategoryPerYear` |
| `netSales` | `CO * salesPricePerUnit[año]` | `computeNetSales` |
| `indirectMaterials` | `netSales * indirectProductPercentage[año]` | `computeIndirectMaterialCosts` |
| `totalCostOfSales` | `rawMaterial + directLabour + indirectManufacturing + engineeringSalaries + indirectMaterials` | `buildCostOfSalesTable` |
| `grossProfit` | `netSales - totalCostOfSales` | `computeGrossProfit` |
| `depreciation` | suma de `computeFixedAssetsByCategory` (todas las categorías, incl. Maquinaria vía `capacity.machines`) | `computeFixedAssetsByCategory` |
| `administrativeSalary` | salario admin por año (Empleados_2) | — |
| `administrativeExpenses` | `administrativeSalary + netSales * adminPct[año]` | `computeAdministrativeExpenses` |
| `salesExpenses` | `netSales * salesExpensePct[año]` | `computeSalesExpenses` |
| `operatingExpenses` | `administrativeExpenses + administrativeSalary + depreciation` — **`salesExpenses` está en la firma pero comentado (línea 356), NO se suma** | `computeOperatingExpenses` ⚠️ |
| `operatingProfit` | `grossProfit - operatingExpenses` | `computeOperatingProfit` |
| `financingAmount` | `machineryInvestment[año0] + investment[año0] + administrativeExpenses[año0] + salariesTotal(flat) + civilWorks[año0]` — **solo año 0**, `0` el resto | `computeFinancingAmount` |
| `financialExpenses`/`creditPayment` | amortización recta sobre `financingAmount`, tasa fija de origen (`nationalLeadingRate[año0]`), partida en bloques de 12 meses por año | `computeAmortizationSchedule` |
| `incomeBeforeTaxes` | `operatingProfit - financialExpenses - creditPayment + financialIncome(0, manual)` | `computeIncomeBeforeTaxes` |
| `isr`/`ptu` | `incomeBeforeTaxes * tasa[año]` si `incomeBeforeTaxes >= 0`, si no `0` | `computeTaxes` |
| `netIncome` | `incomeBeforeTaxes - (isr + ptu)` | `computeNetIncome` |

```js
// buildCostOfSales.js — orden real de la cadena
const financingAmount = computeFinancingAmount(
  investment, salariesTotal, administrativeExpenses, machineryInvestment, civilWorks, years[0]
)
const { financialExpensesByYear: financialExpenses, creditPaymentByYear: creditPayment } =
  computeAmortizationSchedule(financingAmount, opex.financingPeriods, opex.nationalLeadingRate[years[0]], years)
```

⚠️ Notas conocidas (algunas ya arregladas en esta rama, otras pendientes —
ver backlog):
- `financingAmount` fijo en `years[0]`; ya se corrigió para que solo se
  reporte como entrada de caja ese año (antes se repetía cada año en Cash
  Inflows).
- `salesExpenses` no se suma en `operatingExpenses` (línea comentada) —
  discrepancia entre el docstring y el código, sin resolver.
- Dos funciones distintas llamadas `computeAdminExpenses` en el repo
  (`costCalculations.js:149` vs `utils/dashboard/computeAdminExpenses.js`) —
  formulas distintas, mismo nombre — ver `.agents/technical-debt.md`.

## 11. Cash Outflows — `outflowCalculations.js`

`src/sims/project-feasibility/costTable/outflowCalculations.js`. No recalcula
nada nuevo — reusa casi todos los campos de `costOfSalesByYear`, y agrega el
capex real (compra puntual, no valor de libro repetido):

```js
export function computeCapexByYear(cbm, years) {
  // assetsCapexInYear: solo cuenta el año en que el activo se adquirió
  // realmente (primer año con valor > 0), no cada año que aparece en el Excel.
  capexByYear[year] = {
    machinery: assetsCapexInYear(opex.machines, year, years),
    buildings: assetsCapexInYear(opex.assets.buildings, year, years),
    compute: assetsCapexInYear(opex.assets.compute, year, years),
    transport: assetsCapexInYear(opex.assets.transport, year, years),
    extra: { /* una entrada por cada categoría de Inversion que no sea building/transport/compute/maquinaria */ },
  }
}
```

`outflowBaseValue(rowKey, year, rowByYear, capexByYear)` es el switch que
resuelve cada fila (`rawMaterial`, `directLabour`, `administrativeGeneral =
administrativeExpenses - administrativeSalary`, `machineryPurchase =
capex.machinery`, `civilWorks`, `creditPayment`, `taxes = isr + ptu`,
`insurance`/`otherExpenses` = `0` fijo, sin campo fuente en el Excel).

## 12. Cash Inflows / saldo — `cashFlowCalculations.js`

`src/sims/project-feasibility/costTable/cashFlowCalculations.js`. El saldo se
encadena año a año, no se recalcula desde cero:

```js
const totalEntradasSalidas = (year, saldoInicial) => {
  const totalEntradas = ENTRADA_ROWS.reduce((sum, row) => sum + (
    row.key === 'saldoInicial' ? saldoInicial : baseEntradaValue(row.key, year, rowByYear)
  ), 0)
  const totalSalidas = outflowRows.reduce(
    (sum, row) => sum + outflowBaseValue(row.key, year, rowByYear, capexByYear), 0
  )
  return totalEntradas - totalSalidas
}
// saldoInicial[año] = totalEntradasSalidas(año-1) encadenado desde premises.startingMoney
```

`ENTRADA_ROWS`: `saldoInicial`, `ventas (netSales)`, `prestamoLargoPlazo
(financingAmount, solo año 0)`, `prestamoCortoPlazo (0, manual)`,
`otrosIngresos (0, manual)`.

## 13. Unit Costs (pestaña Income) — `computeProductionCosts.js`

`src/sims/project-feasibility/income/computeProductionCosts.js`. **Motor
paralelo**, no reusa `buildCostOfSales` — recalcula MP/salarios/admin por su
cuenta para expresarlos "por unidad" (÷ CO o ÷ work orders), no por año
completo:

```js
export default function computeProductionCost(project) {
  const cbm = cbmToCostTableInputs(project)
  const costRawMaterials = computeRawMaterialCost(cbm.production)       // mismo MP que Income Statement
  const workForce = computeWorkforceAnualSalaries(project, cbm)          // OTRO cálculo de salarios (÷ CO, no per-year map)
  const adminExpenses = computeAdminExpenses(project)                    // computeAdminExpenses de costCalculations.js (mensual, sin ×12)
  ...
}
```

`toCostPerWorkOrder(...)` divide cada total anual entre `purchaseOrders[año]`
para dar costo por unidad. Ver `.agents/technical-debt.md` — esta duplicación
(dos formas de calcular salarios/admin) es deuda conocida, no tocar sin
revisar Outflows a la vez.

## 14. Balance Sheet — `balance/*.js`

`computeActives(project)` (`balance/computeActives.js`) junta:

| Sub-cálculo | Archivo | Estado |
|---|---|---|
| `currentActives` (Caja, Inventario, Depósitos, Stocks) | `computeCurrentActives.js` | Caja real (`computeCashBalanceByYear`); Inventario/Depósitos/Stocks son `mockFills` (0) — sin campo fuente confirmado ni en el Excel de referencia |
| `investment` (inversión inicial total) | `income/computeInvestment.js` | Real, suma `acquisitionByYear` de activos + máquinas + nómina + obra civil |
| `fixedAssetsByCategory`/`fixedAssets` | `computeFixedAssets.js` | Depreciación real por categoría (incl. Maquinaria vía `capacity.machines`, filtrada de duplicados de Inversion) |
| `deferedActives` | `computeDeferedActives.js` | Calcula bien (`seguros`/`pagoSeguros`, ceros reales) pero la UI (`DeferedActives.jsx`) no tiene filas fijas — tabla se ve vacía |

`computePassives(project)` (`balance/computePassives.js`):

```js
const { total } = computeInvestment(project)                    // ⚠️ usa la inversión TOTAL, no financingAmount
const { yearAmortization, yearInterest } = computeAmortizationInterest(total, project)  // otro amortizador, distinto de computeAmortizationSchedule

const pending = total - yearAmortization[idx] * (idx + 1)        // ⚠️ fórmula de capital pendiente incorrecta
// currentPassives: siempre {} - sin campo fuente confirmado en el Excel de referencia (12 hojas revisadas)
```

`computeLongTermPassive.js` existe pero es un **stub muerto** — nadie lo
importa, `computePassives.js` hace el cálculo real (y ahí está el bug).

`Equity.jsx` calcula `periodUtility[año] = totalsByYear[año].netIncome` (real,
correcto) y lo encadena para la utilidad acumulada.

## 15. Ratios — `FinancialRatios.jsx`

`src/components/sims/program/FinancialRatios.jsx`. Todas las fórmulas están
en un solo array (`RATIO_DEFINITIONS`), cada una lee
`useEffectiveBalanceTotals(cbm)` (que junta Actives + Passives + Income
Statement, override-aware):

```js
{ key: "currentRatio", compute: (t) => safeDivide(t.currentActivesTotal, t.currentPassivesTotal) },
{ key: "acidTest",     compute: (t) => safeDivide(t.currentActivesTotal - t.inventory, t.currentPassivesTotal) },
{ key: "workingCapital", compute: (t) => t.currentActivesTotal - t.currentPassivesTotal },
{ key: "debtToAssets",   compute: (t) => safeDivide(t.totalPassives, t.totalActives), format: formatPercent },
{ key: "equityToAssets", compute: (t) => safeDivide(t.totalActives - t.totalPassives, t.totalActives), format: formatPercent },
{ key: "assetTurnover",  compute: (t) => safeDivide(t.netSales, t.totalActives) },
{ key: "netProfitMargin", compute: (t) => safeDivide(t.netIncome, t.netSales), format: formatPercent },
{ key: "returnOnAssets", compute: (t) => safeDivide(t.netIncome, t.totalActives), format: formatPercent },  // ⚠️ debería ser escalar, no %
```

`safeDivide(a, b) = b ? a/b : NaN` → `NaN` se muestra como `"—"`. Como
`currentPassivesTotal` casi siempre es `0` (ver sección 14), Current Ratio y
Acid Test salen en `"—"` aunque la fórmula esté bien.

## 16. TREMA / TIR / VNA — `financialEvaluation.js`

`src/utils/dashboard/financialEvaluation.js`, consumido por
`ProjectEvaluationSummary.jsx`:

```js
export function computeTrema(marketRate, inflation, riskPremium) {
  return marketRate + inflation + riskPremium   // riskPremium: manual, sin campo fuente
}
export function computeNPV(cashFlows, rate) {
  return cashFlows.reduce((sum, cf, t) => sum + cf / (1 + rate) ** t, 0)
}
export function computeIRR(cashFlows, { low = -0.99, high = 10, ... }) {
  // bisección; regresa null si NPV no cambia de signo entre low y high (no hay raíz)
}
export function decideProject(npv, irr, trema) {
  if (irr === null) return { accepted: false, reason: "IRR couldn't be computed..." }
  return { accepted: npv > 0 && irr > trema, reason: null }
}
```

`netCashFlowByYear` viene de `ENTRADA_ROWS`/`outflowBaseValue` (totalEntradas
- totalSalidas por año, no el saldo acumulado). Si el flujo nunca es negativo
en ningún año, `computeIRR` regresa `null` y el proyecto se marca
"Rejected" **aunque el VNA sea positivo** — la regla de decisión exige TIR Y
VNA, no solo VNA.

## 17. Break-even — `BreakEvenSummary.jsx`

Solo año 0 (`row = result.costOfSalesByYear[0]`), reusa `buildCostOfSales`:

```js
const fixedCosts = row.administrativeExpenses + row.indirectManufacturing + row.engineeringSalaries + row.creditPayment
const variableCostPerUnit = production.materialCostPerUnit + (row.directLabour / annualCapacity)   // ÷ capacidad anual, no CO del año 0
const contributionMargin = salePrice - variableCostPerUnit
const breakEvenUnits = fixedCosts / contributionMargin
const unitsForProfit = (fixedCosts + desiredProfit) / contributionMargin   // desiredProfit: input manual en la UI
```

Divide entre `annualCapacity` (no las órdenes reales del año 0) a propósito
— un año de arranque con poco volumen distorsionaría el costo unitario de
mano de obra.

## 18. Resumen — pantalla → archivo → fuente de datos

| Pantalla | Archivo principal | Fuente de datos |
|---|---|---|
| Cost Table / Profit Summary | `buildCostOfSales.js` + `costCalculations.js` | `cbmToCostTableInputs`, `cbmToOperatingExpenseInputs` |
| Cash Outflows | `outflowCalculations.js` | `costOfSalesByYear` + `computeCapexByYear` |
| Cash Inflows | `cashFlowCalculations.js` | `costOfSalesByYear` + outflows + `premises.startingMoney` |
| Unit Costs (Income tab) | `computeProductionCosts.js` | motor paralelo, mismo `cbm`, fórmulas propias |
| Balance Sheet | `balance/computeActives.js` + `computePassives.js` + `Equity.jsx` | activos/pasivos/depreciación + `netIncome` |
| Ratios | `FinancialRatios.jsx` | `useEffectiveBalanceTotals` (Balance + Income Statement) |
| TREMA/TIR/VNA | `financialEvaluation.js` | `ENTRADA_ROWS`/`outflowBaseValue` por año |
| Break-even | `BreakEvenSummary.jsx` | `costOfSalesByYear[0]` + `derivedBase.annualCapacity` |

Los ⚠️ de esta parte 2 son los mismos bugs ya diagnosticados en el backlog de
esta conversación (financingAmount, Current Passives vacío, Pasivo Largo
Plazo, ROA, Deferred Actives) — aquí quedan documentados en su forma de
código, no solo como reporte de bug.
