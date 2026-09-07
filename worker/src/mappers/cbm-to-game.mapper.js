const DEFAULT_START_YEAR = 2025;
const DEFAULT_END_YEAR = 2035;
const DEFAULT_PERIODS = 60;

const ENGINEERING_EXACT_NAMES = ['GERENTE DE OPERACIONES'];

const ASSET_CATEGORY = {
  transport: 'transport',
  buildings: 'buildings',
  compute: 'computer',
};

function asNumber(value, fallback = null) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function firstFinite(series) {
  if (!Array.isArray(series)) return null;
  for (const value of series) {
    const number = asNumber(value);
    if (number !== null) return number;
  }
  return null;
}

function sumSeries(series) {
  if (!Array.isArray(series)) return 0;
  return series.reduce((total, value) => total + (asNumber(value, 0) ?? 0), 0);
}

function classifyEmployeeCategory(name, type) {
  const upperName = String(name ?? '').toUpperCase();
  if (upperName.startsWith('MOD ')) return 'direct';
  if (upperName.startsWith('MOID ')) return 'indirect';
  if (upperName.startsWith('IM ') || upperName.includes('INGENIERO')) return 'engineering';
  if (ENGINEERING_EXACT_NAMES.includes(upperName)) return 'engineering';

  const normalizedType = String(type ?? '').trim().toLowerCase();
  if (normalizedType === 'administracion') return 'administrative';
  if (normalizedType === 'operacion') return 'indirect';
  return null;
}

function timelineYears(cbm) {
  const listed = Array.isArray(cbm?.timeline?.years)
    ? cbm.timeline.years.filter((year) => Number.isInteger(year))
    : [];
  if (listed.length) return listed;

  const start = asNumber(cbm?.timeline?.startYear, DEFAULT_START_YEAR);
  const end = asNumber(cbm?.timeline?.endYear, DEFAULT_END_YEAR);
  const years = [];
  for (let year = start; year <= end; year += 1) years.push(year);
  return years;
}

function mapEmployees(cbm) {
  return (cbm?.employees ?? []).map((employee) => {
    const percepcion = asNumber(employee.percepcion, 0);
    const benefits =
      percepcion *
      ((asNumber(employee.imss, 0) ?? 0) +
        (asNumber(employee.infonavit, 0) ?? 0) +
        (asNumber(employee.valesDespensa, 0) ?? 0) +
        (asNumber(employee.primaVacacional, 0) ?? 0) +
        (asNumber(employee.aguinaldo, 0) ?? 0) +
        (asNumber(employee.fondoAhorro, 0) ?? 0) +
        (asNumber(employee.comedor, 0) ?? 0));
    return {
      name: employee.name ?? 'Employee',
      category: classifyEmployeeCategory(employee.name, employee.type),
      type: employee.type ?? null,
      quantity: Math.max(1, Math.round(asNumber(employee.cantidad, 1))),
      baseSalary: percepcion,
      integratedSalary: percepcion + benefits,
      compensation: [
        ['IMSS', employee.imss, null],
        ['Infonavit', employee.infonavit, null],
        ['Vales de despensa', employee.valesDespensa, null],
        ['Prima Vacacional', employee.primaVacacional, null],
        ['Aguinaldo', employee.aguinaldo, null],
        ['Fondo de Ahorro', employee.fondoAhorro, null],
        ['Comedor', employee.comedor, null],
        ['ISR', employee.isr, null],
      ]
        .filter(([, percentage]) => typeof percentage === 'number' && Number.isFinite(percentage))
        .map(([itemName, percentage]) => ({
          itemName,
          percentage,
          amount: percepcion * percentage,
        })),
    };
  });
}

function mapAssets(cbm) {
  const assets = [];
  for (const [block, category] of Object.entries(ASSET_CATEGORY)) {
    for (const item of cbm?.assets?.[block] ?? []) {
      assets.push({
        name: item.name ?? category,
        category,
        unitPrice: sumSeries(item.acquisitionByYear),
        acquisitionByYear: item.acquisitionByYear ?? [],
      });
    }
  }
  for (const machine of cbm?.capacity?.machines ?? []) {
    assets.push({
      name: machine.description ?? machine.code ?? 'Machine',
      category: 'machine',
      unitPrice: sumSeries(machine.acquisitionByYear),
      acquisitionByYear: machine.acquisitionByYear ?? [],
    });
  }
  return assets;
}

export function mapCbmToGamePlan(cbm, fallbackName) {
  const years = timelineYears(cbm);
  const premises = cbm?.premises ?? {};
  const line = cbm?.capacity?.line ?? {};

  return {
    game: {
      name: cbm?.metadata?.name || cbm?.bom?.productName || fallbackName || 'Project',
      startYear: years[0] ?? DEFAULT_START_YEAR,
      endYear: years[years.length - 1] ?? DEFAULT_END_YEAR,
      periods: asNumber(cbm?.timeline?.financingPeriods, DEFAULT_PERIODS),
    },
    years,
    premises: {
      exchangeRate: firstFinite(premises.fxClose),
      nationalLeadingRate: firstFinite(premises.nationalLeadingRate),
      cpp: firstFinite(premises.cpp),
      cetes: firstFinite(premises.cetes),
      libor: firstFinite(premises.libor),
      nationalInflation: firstFinite(premises.nationalInflation),
      foreignInflation: firstFinite(premises.foreignInflation),
      isr: firstFinite(premises.isr),
      impac: firstFinite(premises.impac),
      ptu: firstFinite(premises.ptu),
      inventoryPct: firstFinite(premises.inventoryPct),
      suppliersPct: firstFinite(premises.suppliersPct),
      shortTermLiabilityPct: firstFinite(premises.shortTermLiabilityPct),
      directProductCostPct: firstFinite(premises.directProductCostPct),
      indirectProductCostPct: firstFinite(premises.indirectProductCostPct),
      salesExpensePct: firstFinite(premises.salesExpensePct),
      adminPct: firstFinite(premises.adminPct),
      depreciationBuildings: firstFinite(premises.depreciationBuildings),
      depreciationMachinery: firstFinite(premises.depreciationMachinery),
      depreciationTransport: firstFinite(premises.depreciationTransport),
      depreciationCompute: firstFinite(premises.depreciationCompute),
      yearly: years.map((year, index) => ({
        year,
        exchangeRate: asNumber(premises.fxClose?.[index]),
        nationalLeadingRate: asNumber(premises.nationalLeadingRate?.[index]),
        cpp: asNumber(premises.cpp?.[index]),
        cetes: asNumber(premises.cetes?.[index]),
        libor: asNumber(premises.libor?.[index]),
        nationalInflation: asNumber(premises.nationalInflation?.[index]),
        foreignInflation: asNumber(premises.foreignInflation?.[index]),
        isr: asNumber(premises.isr?.[index]),
        impac: asNumber(premises.impac?.[index]),
        ptu: asNumber(premises.ptu?.[index]),
        inventoryPct: asNumber(premises.inventoryPct?.[index]),
        suppliersPct: asNumber(premises.suppliersPct?.[index]),
        shortTermLiabilityPct: asNumber(premises.shortTermLiabilityPct?.[index]),
        directProductCostPct: asNumber(premises.directProductCostPct?.[index]),
        indirectProductCostPct: asNumber(premises.indirectProductCostPct?.[index]),
        salesExpensePct: asNumber(premises.salesExpensePct?.[index]),
        adminPct: asNumber(premises.adminPct?.[index]),
        depreciationBuildings: asNumber(premises.depreciationBuildings?.[index]),
        depreciationMachinery: asNumber(premises.depreciationMachinery?.[index]),
        depreciationTransport: asNumber(premises.depreciationTransport?.[index]),
        depreciationCompute: asNumber(premises.depreciationCompute?.[index]),
      })),
    },
    expenses: (cbm?.services ?? []).map((service) => ({
      category: service.category || 'Services',
      subcategory: service.subcategory || service.description || 'Service',
      name: service.description || service.subcategory || 'Service',
      description: service.description || '',
      defaultCost: asNumber(service.monthlyAmount, 0),
    })),
    assets: mapAssets(cbm),
    employees: mapEmployees(cbm),
    bom: {
      productName: cbm?.bom?.productName || fallbackName || 'Product',
      salePrice: asNumber(cbm?.bom?.salePrice),
      parts: (cbm?.bom?.parts ?? []).map((part) => ({
        code: part.id || 'part',
        material: part.description || part.id || 'Material',
        amount: asNumber(part.quantity, 0),
        price: asNumber(part.cost, 0),
      })),
    },
    demand: {
      yearZeroYear: asNumber(cbm?.demand?.yearZeroYear),
      yearZeroTotal: asNumber(cbm?.demand?.yearZeroTotal),
      monthShares: cbm?.demand?.monthShares ?? [],
    },
    capacity: {
      qualityYield: asNumber(line.qualityYield),
      secondsPerUnit: asNumber(line.secondsPerUnit),
      hoursShift: asNumber(line.hoursShift),
      shifts: asNumber(line.shifts),
      productionLineCount: asNumber(line.productionLines),
      weekWorkingDays: asNumber(line.weekWorkingDays),
      yearWorkingMonths: asNumber(line.yearWorkingMonths),
    },
  };
}
