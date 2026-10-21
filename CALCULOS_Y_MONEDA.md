# Cálculos y conversión de moneda — Project Feasibility

Referencia de cómo se calcula cada tabla financiera y cómo funciona el cambio de moneda (MXN/EUR/USD). Todo vive bajo `src/sims/project-feasibility/`.

## En español sencillo (sin código)

Piensa en el proyecto como un negocio real que existe 10-11 años. Todo arranca del Excel que subes (cuánto vendes, cuánto gastas, cuánto pides prestado). De ahí se calculan, en cadena, estos bloques:

1. **Costo de Ventas / Estado de Resultados** — ¿cuánto vendiste, cuánto te costó producirlo, y qué te queda de ganancia (utilidad) después de gastos e impuestos? Es la resta simple: Ventas − Costos − Gastos − Impuestos = Utilidad Neta.

2. **Depreciación de Activos Fijos** — un camión, una máquina, un edificio, se van "gastando" con el uso. Cada año se resta un pedacito de su valor (un % que tú mismo defines en el Excel). Ese % se busca primero por el nombre del activo, si no existe se usa el de su categoría, si tampoco existe es 0%.

3. **Flujo de Efectivo (Cash Flow)** — cuánto dinero entra (ventas, préstamos) y cuánto sale (sueldos, materia prima, pago de deudas) cada año. Lo que sobra un año se vuelve el dinero con el que empiezas el siguiente (como tu saldo bancario que se arrastra mes a mes).

4. **Balance General** — una foto de "qué tienes" (activos: caja, inventario, máquinas) vs "qué debes" (pasivos: deudas) vs "qué es realmente tuyo" (capital/equity = activos − pasivos).

5. **Razones Financieras (Ratios)** — comparaciones simples para saber si el negocio está sano:
   - **Current Ratio / Prueba del Ácido**: ¿con cuánto efectivo/activos de rápida conversión cuentas por cada peso que debes a corto plazo? (más alto = más colchón)
   - **Capital de Trabajo**: lo que te queda libre después de pagar tus deudas de corto plazo, en dinero real.
   - **Índice de Endeudamiento**: de todo lo que tiene el negocio, ¿qué proporción es deuda?
   - **Capital Contable / Activo**: de todo lo que tiene el negocio, ¿qué proporción es realmente tuya (no deuda)?
   - **Rotación de Activo Total**: ¿cuánto vendes por cada peso invertido en el negocio?
   - **Margen de Utilidad Neta**: de cada peso que vendes, ¿cuánto termina siendo ganancia?
   - **Rendimiento sobre la Inversión (ROA)**: de cada peso invertido en el negocio, ¿cuánto te regresa en ganancia?

6. **¿Conviene el proyecto? (TREMA / VNA / TIR)** — la pregunta de fondo es "¿vale la pena meter mi dinero aquí, o mejor lo pongo en el banco?".
   - **TREMA**: el rendimiento mínimo que le exigirías a tu dinero (tasa de interés del mercado + inflación + un extra por el riesgo de que algo salga mal).
   - **VNA (Valor Presente Neto)**: traes todo el dinero que vas a ganar en el futuro "a pesos de hoy" (porque un peso hoy vale más que un peso dentro de 5 años) y sumas. Si el resultado es positivo, el proyecto genera más de lo que exigías.
   - **TIR**: el rendimiento real que da el proyecto, como número. Si es mayor que tu TREMA, el proyecto conviene.
   - Hay un ⚠️ pendiente: el número que se usa hoy para este cálculo no es exactamente el correcto (ver sección técnica de VNA/TIR más abajo) — el resultado en la app puede no cuadrar todavía con tu Excel.

7. **Cambio de moneda (MXN/EUR/USD)** — el Excel siempre se captura en pesos mexicanos. Si eliges ver todo en euros o dólares, la app busca el tipo de cambio del día (una tasa pública, actualizada diario) y multiplica **solo el dinero real** (ventas, sueldos, precios, saldo inicial) por esa tasa. Las cosas que ya son un porcentaje (inflación, tasa de impuestos, % de depreciación) NO se tocan, porque un porcentaje no cambia de "moneda" — 10% de inflación es 10% de inflación sin importar si hablas de pesos o dólares.

## Pipeline general

```
Excel InputNovus → parse/sheets.js (readInversion, readPremisas, readCOs, ...) → cbm (canonical business model)
    → cbmToCostTableInputs.js → buildCostOfSales.js → Income Statement / Cost Table
    → cashFlowCalculations.js → Cash Table / Cash Flow
    → balance/compute*.js → Balance Sheet
    → useEffectiveBalanceTotals.js → Financial Ratios
```

Todo lo que sale de una fórmula parte del `cbm` parseado del Excel. Cuando InputNovus no trae un dato fuente (ej. Risk Premium, Seguros), el valor es manual/override en $0 — nunca un número inventado.

## Cost Table / Income Statement

`costTable/buildCostOfSales.js` es el motor central: toma `cbm` y produce, por año, Costo de Ventas → Utilidad Bruta → Utilidad de Operación → Utilidad antes de Impuestos → Impuestos → Utilidad Neta. Casi todo lo demás (Cash Flow, Break-even, tasas de Activo Fijo, Ratios) lee este resultado (`costOfSalesByYear`), no vuelve a calcular desde cero.

- Precio de venta y costo de materia prima **crecen con inflación nacional** año a año (no son planos).
- Volumen de venta viene de `demandGrowth` + los totales reales que trae la hoja de COs (si el Excel ya trae el total de un año, ese gana sobre la proyección).

## Fixed Assets (depreciación)

`balance/computeFixedAssets.js`: depreciación **por activo individual**, no por categoría agrupada. Para cada activo busca la tasa en este orden:
1. Tasa con el nombre exacto del activo en Premisas (ej. "Vaca").
2. Si no existe, la tasa de su categoría (ej. "Animales").
3. Si tampoco existe, 0%.

Categorías de activos (`assets.byCategory`) se detectan de forma **estructural** en `readInversion` (por forma de fila/año-columnas), no por lista fija de nombres — cualquier categoría que el usuario meta en el Excel se respeta igual.

## Cash Flow

`costTable/cashFlowCalculations.js` → `computeCashBalanceByYear(cbm)`:

- Saldo Inicial año 0 = `premises.startingMoney`.
- Cada año: `Total Entradas (incluye Saldo Inicial + Ventas + Préstamos + Otros Ingresos) − Total Salidas`.
- El resultado de un año se vuelve el Saldo Inicial del año siguiente (cadena corrida).
- Devuelve `saldoInicialByYear` (inicio) y `endingBalanceByYear` (fin de año) — este último es lo que usa Balance Sheet para "Caja y Bancos".

**Ojo:** esto es el **saldo acumulado**, no el flujo neto del periodo. Balance Sheet lo necesita así (saldo de caja real), pero ver sección de VNA/TIR abajo — ahí es donde este mismo número causa un bug.

## Balance Sheet

- **Current Actives**: Caja y Bancos (de arriba) + Inventario/Depósitos/Stocks (mock fills, sin fuente en InputNovus).
- **Fixed Assets**: por categoría, con depreciación por ítem (ver arriba).
- **Defered Actives** (RF-70): Seguros y Pago de Seguros — ambos en $0, InputNovus no trae fuente para ninguno (confirmado revisando las 12 hojas).
- **Total Actives** (`computeTotalActives.js`): suma Current + Fixed (valor neto) + Defered.
- **Equity** (`computeEquity.js`): `legacy = Total Activos − Total Pasivos − Utilidad del Periodo − Utilidad Acumulada`; Utilidad del Periodo sale de `buildCostOfSales`, Utilidad Acumulada es la suma corrida de los 2 años previos.

## Financial Ratios (RF-74)

`FinancialRatios.jsx`, usa `useEffectiveBalanceTotals` (totales de Balance Sheet ya con overrides del usuario aplicados). 8 razones, formato ajustado para **matchear el Template Financiero de referencia** (no el estándar contable típico):

| Ratio | Fórmula | Formato |
|---|---|---|
| Current Ratio | Activo Circulante / Pasivo Circulante | `x` |
| Acid Test | (Activo Circulante − Inventario) / Pasivo Circulante | `x` |
| Working Capital | Activo Circulante − Pasivo Circulante | moneda |
| Debt to Assets | Pasivo Total / Activo Total | decimal plano |
| Equity to Assets | (Activo Total − Pasivo Total) / Activo Total | decimal plano |
| Total Asset Turnover | Ventas Netas / Activo Total | `x` |
| Net Profit Margin | Utilidad Neta / Ventas Netas | decimal plano *(recién arreglado — antes mostraba %, el Excel usa decimal plano)* |
| Return on Assets | Utilidad Neta / Activo Total | decimal plano |

3 filas del template de referencia (Rotación de inventarios, Rotación de proveedores, Utilidad de Operación a ventas) no tienen fórmula en ninguna de las 12 hojas del Excel — se dejan fuera en vez de inventar una fórmula.

**Pendiente sin resolver:** el sufijo `x` en Current Ratio/Acid Test/Total Asset Turnover — el Excel de referencia los muestra como número plano, sin sufijo. No confirmado todavía si quitarlo.

## Evaluación del proyecto (TREMA / VNA / TIR) — RF-65/66/67

`costTable/ProjectEvaluationSummary.jsx` + `utils/dashboard/financialEvaluation.js`:

- **TREMA** = Mejor Tasa de Mercado (Premisas) + Inflación (Premisas) + Premio al Riesgo (manual, sin fuente en InputNovus, default 10%).
- **VNA (NPV)**: `computeNPV(cashFlows, rate)`.
- **TIR (IRR)**: bisección sobre el rango [-99%, 1000%] hasta que VNA cruce cero.
- **Decisión**: se acepta si VNA > 0 Y TIR > TREMA.

**🔴 Bug conocido, no arreglado todavía:** la serie de flujos que se le pasa a VNA/TIR es `computeCashBalanceByYear(cbm).endingBalanceByYear` — es decir, el **saldo acumulado de caja** (arrastra el Saldo Inicial de años previos), no el "Flujo Neto de Efectivo" período por período que usa el Excel (`Total de Entradas − Total de Salidas` de ESE año, sin arrastre). Comparado contra tu Excel (TREMA 22%, TIR 23.64%, Valor Presente $6,036,330.52), el cálculo actual no da ese mismo resultado. Falta:
1. Confirmar la fórmula exacta de la celda VNA en tu Excel (si descuenta el año 0 o no).
2. Cambiar `netCashFlowByYear` en `ProjectEvaluationSummary.jsx` para usar Entradas (sin Saldo Inicial) − Salidas por año, en vez de `endingBalanceByYear`.

## Conversión de moneda (MXN / EUR / USD)

Flujo: `ProjectDashboard.jsx` (selector) → `useFeasibilityModel(gameId, currencyIn, currencyOut)` → `getFeasibilityModel.service.js` → `feasibilityProjectCurrencyChange(data, rate)`.

- `currencyIn` está **fijo en `"MXN"`** (el Excel siempre se captura en pesos) — el selector solo controla `currencyOut`.
- Si `currencyIn === currencyOut`, no hay conversión, se regresa el cbm tal cual.
- Si no, `currencyExchange.js` pide la tasa en vivo a `https://api.frankfurter.dev/v2/rate/{in}/{out}` (tasa del día, `America/Mexico_City`) y `feasibilityProjectCurrencyChange` clona el cbm completo y multiplica **solo montos reales en dinero**:
  - `premises.startingMoney`
  - `bom.salePrice`, `bom.parts[].cost`
  - `employees[].percepcion`
  - `services[].monthlyAmount`
  - `assets.byCategory[...].acquisitionByYear` (+ los 3 legacy `transport`/`buildings`/`compute`)
  - `capacity.machines[].acquisitionByYear`

  **NO se tocan** tasas ni porcentajes (inflación, ISR, PTU, % admin, % depreciación, tasa líder, demand growth) — esos son adimensionales, no dinero.

- El resultado trae `result.currencyRate = rate` expuesto, para que cálculos que no leen el cbm directo (ej. el Stock mockeado en `computeCurrentActives`) sigan escalando igual.
- **Formato visual**: `formatCurrency.util.js` recibe `currency` ("MXN"/"USD"/"EUR") y usa `toLocaleString("en-US", { style: "currency", currency })` — solo cambia el símbolo/formato de despliegue, la conversión real del número ya pasó por `feasibilityProjectCurrencyChange` antes de llegar aquí.

### Reportado sin confirmar todavía

Dos bugs de moneda reportados (Beginning Balance en Cash Table, Stocks en Current Actives — "se mantiene en MXN" al cambiar el selector): revisado el cableado (query key sí incluye `currencyOut`, `startingMoney`/`currencyRate` sí se convierten) y no se encontró el bug leyendo código solo. No confirmado en vivo — falta reproducir en navegador o repro más específico.
