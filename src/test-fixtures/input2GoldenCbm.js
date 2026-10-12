import {
  YEARS,
  PREMISAS,
  DEMAND,
  CAPACITY,
  BOM,
  SALARIOS,
  GASTOS_ADMIN,
  INVERSION,
  DEPRECIACION,
  FINANCIAMIENTO,
  FLUJO,
} from "./input2Golden.js";

const flat = (value) => Array(YEARS.length).fill(value);

/**
 * Synthetic cbm reproducing Input_2 (Dron Super Sport) closely enough that
 * the REAL pipeline (buildCostOfSales -> computeFinancing/computeActives/
 * computePassives/computeFixedAssetsByCategory) reproduces the golden
 * numbers in input2Golden.js. Verified by hand against the real formulas
 * before writing this (see PR/commit notes) - financingAmount, working
 * capital, civil works and fixed-asset depreciation all land exactly on
 * the Excel's own numbers; payroll/sales/material-cost inflation
 * compounding matches within rounding (see each RF test file's tolerance).
 *
 * Employees/services are collapsed to one synthetic row per category/total
 * (quantity=1, monthlySalary=annual/12) instead of the original's 17
 * employees + 18 service line items - sumSalariesByCategory/
 * computeAdminExpenses only ever need the CATEGORY TOTAL, so this reproduces
 * the exact same base amount with far less fixture code.
 */
export function buildInput2Cbm() {
  return {
    timeline: {
      years: YEARS,
      financingPeriods: FINANCIAMIENTO.periodos,
    },
    premises: {
      startingMoney: FLUJO.saldoInicial[0],
      nationalInflation: PREMISAS.inflacionNacional,
      isr: PREMISAS.tasaISR,
      ptu: PREMISAS.tasaPTU,
      indirectProductCostPct: PREMISAS.pctCostoIndirecto,
      depreciationBuildings: flat(PREMISAS.depEdificios),
      depreciationTransport: flat(PREMISAS.depTransporte),
      depreciationMachinery: flat(PREMISAS.depMaquinaria),
      depreciationCompute: flat(PREMISAS.depComputo),
      nationalLeadingRate: PREMISAS.tasaLider,
      adminPct: flat(0),
      salesExpensePct: flat(0),
      demandGrowth: 0,
    },
    demand: {
      yearZeroYear: YEARS[0],
      yearZeroTotal: DEMAND.annualCOs[0],
      yearZeroOrders: [],
      monthShares: [],
      history: [],
      // Every year the Excel's COs sheet gives a real total overlays the
      // demandGrowth projection outright (see cbmToCostTableInputs.js) -
      // giving all 11 years here means the projection math never kicks in.
      yearlyTotals: YEARS.map((year, i) => ({ year, total: DEMAND.annualCOs[i] })),
    },
    bom: {
      salePrice: BOM.costoVenta,
    },
    derivedBase: {
      bomMaterialCost: BOM.costoMateriaPrima,
      employees: [
        { name: "MOD", category: "direct", quantity: 1, salarioIntegrado: SALARIOS.resumen.MOD[0] / 12 },
        { name: "MOID", category: "indirect", quantity: 1, salarioIntegrado: SALARIOS.resumen.MOID[0] / 12 },
        { name: "Ingenieria", category: "engineering", quantity: 1, salarioIntegrado: SALARIOS.resumen.ingenieria[0] / 12 },
        { name: "Administrativos", category: "administrative", quantity: 1, salarioIntegrado: SALARIOS.resumen.administrativos[0] / 12 },
      ],
    },
    services: [
      {
        category: "Gastos Administrativos",
        subcategory: "Consolidado",
        description: "Servicios administrativos (consolidado para el fixture)",
        monthlyAmount: GASTOS_ADMIN.gastosServiciosBase / 12,
        notes: null,
      },
    ],
    capacity: {
      line: {
        // Real series has 9 entries - pads with the last real value (0.9)
        // for years 2034/2035, same as the template holding it flat late.
        qualityYield: [...CAPACITY.qualityYield, 0.9, 0.9],
      },
      // Machinery lives ONLY in Capacidad for this project (no "Maquinaria"
      // category in Inversion) - resolveMachineryAssets/machineryAssetsFromInversion
      // both fall back to this list, matching how the real project is set up.
      // Split in 2 so the book value itself drops from $10,004,000 (year 0,
      // base + a one-time $200,000 addition) to $9,804,000 (year 1+) - same
      // shape that produces the real depAnual2025=$1,000,400 vs
      // depAnual2026plus=$980,400 (verified by hand, see file docblock).
      machines: [
        { name: "Maquinaria base", acquisitionByYear: flat(DEPRECIACION.maquinaria.total2026plus) },
        {
          name: "Maquinaria adicional (solo ano 0)",
          acquisitionByYear: [
            DEPRECIACION.maquinaria.total2025 - DEPRECIACION.maquinaria.total2026plus,
            ...Array(YEARS.length - 1).fill(0),
          ],
        },
      ],
    },
    assets: {
      byCategory: {
        Edificios: [{ name: "Edificio", acquisitionByYear: flat(INVERSION.edificio) }],
        "Equipo de Transporte": [{ name: "Transporte", acquisitionByYear: flat(INVERSION.transporte) }],
        "Equipo de Computo": [{ name: "Computo", acquisitionByYear: flat(INVERSION.equipoComputo) }],
      },
      buildings: [{ name: "Edificio", acquisitionByYear: flat(INVERSION.edificio) }],
      transport: [{ name: "Transporte", acquisitionByYear: flat(INVERSION.transporte) }],
      compute: [{ name: "Computo", acquisitionByYear: flat(INVERSION.equipoComputo) }],
    },
  };
}
