// Maps a saved category (free text, whatever readInversion found at upload
// time) back to the legacy fixed bucket the Cost Table/Operating Expenses
// pipeline still hardcodes to - matches both the raw Spanish Excel label and
// the English label older rows may have been saved under. A category that
// matches none of these only ever lands in byCategory, not a legacy bucket
// (nothing else needs it).
const LEGACY_ASSET_KEY_BY_MATCH = [
  { match: 'equipo de transporte', key: 'transport' },
  { match: 'transport equipment', key: 'transport' },
  { match: 'edificios', key: 'buildings' },
  { match: 'buildings', key: 'buildings' },
  { match: 'equipo de computo', key: 'compute' },
  { match: 'computer equipment', key: 'compute' },
];

function legacyAssetKey(category) {
  const normalized = String(category ?? '').toLowerCase().trim();
  return LEGACY_ASSET_KEY_BY_MATCH.find((item) => normalized.startsWith(item.match))?.key ?? null;
}

const COMPENSATION_FIELDS = {
  imss: 'imss',
  infonavit: 'infonavit',
  'vales de despensa': 'valesDespensa',
  'prima vacacional': 'primaVacacional',
  aguinaldo: 'aguinaldo',
  'fondo de ahorro': 'fondoAhorro',
  comedor: 'comedor',
  isr: 'isr',
};

function asNumber(value, fallback = undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function yearsFromGame(game) {
  const start = Number.parseInt(game.start_date, 10);
  const end = Number.parseInt(game.end_date, 10);
  if (!Number.isInteger(start) || !Number.isInteger(end) || end < start) {
    return [];
  }
  const years = [];
  for (let year = start; year <= end; year += 1) years.push(year);
  return years;
}

function seriesFromYearly(years, rows, field, fallback) {
  const byYear = new Map((rows ?? []).map((row) => [row.year, row[field]]));
  return years.map((year) => asNumber(byYear.get(year), asNumber(fallback)));
}

function normalizeCompensationName(name) {
  return String(name ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

function typeFromJobTitle(jobTitle) {
  const normalized = String(jobTitle ?? '').toLowerCase();
  if (normalized === 'administrative' || normalized === 'administracion') {
    return 'administracion';
  }
  return 'operacion';
}

function acquisitionSeries(years, costsByYear, fallback) {
  const firstYear = years[0];
  return years.map((year) => {
    if (costsByYear.has(year)) return asNumber(costsByYear.get(year), 0);
    if (year === firstYear) return asNumber(fallback, 0);
    return 0;
  });
}

export function mapGameRowsToCbm({
  game,
  premises,
  premisesYearly,
  premisesPercentage,
  premisesPercentageYearly,
  premisesDeprecations,
  premisesDeprecationsYearly,
  employees,
  compensation,
  assets,
  assetCosts,
  capacity,
  productionLine,
  bom,
  bomParts,
  services,
  yearZeroDemand,
  monthShares,
}) {
  const years = yearsFromGame(game);
  const compensationByEmployee = new Map();
  for (const item of compensation ?? []) {
    const list = compensationByEmployee.get(item.employee_id) ?? [];
    list.push(item);
    compensationByEmployee.set(item.employee_id, list);
  }

  const mappedEmployees = (employees ?? []).map((employee) => {
    const row = {
      name: employee.name,
      type: typeFromJobTitle(employee.job_title),
      percepcion: asNumber(employee.base_salary),
      cantidad: Math.max(1, Math.round(asNumber(employee.quantity, 1))),
      imss: undefined,
      infonavit: undefined,
      valesDespensa: undefined,
      primaVacacional: undefined,
      aguinaldo: undefined,
      fondoAhorro: undefined,
      comedor: undefined,
      isr: undefined,
    };
    for (const item of compensationByEmployee.get(employee.id) ?? []) {
      const field = COMPENSATION_FIELDS[normalizeCompensationName(item.item_name)];
      if (field) row[field] = asNumber(item.percentage);
    }
    return row;
  });

  const costsByAsset = new Map();
  for (const cost of assetCosts ?? []) {
    const map = costsByAsset.get(cost.asset_id) ?? new Map();
    map.set(cost.year, cost.cost);
    costsByAsset.set(cost.asset_id, map);
  }

  const groupedAssets = { transport: [], buildings: [], compute: [], byCategory: {} };
  const machines = [];
  for (const asset of assets ?? []) {
    const item = {
      name: asset.name,
      acquisitionByYear: acquisitionSeries(
        years,
        costsByAsset.get(asset.id) ?? new Map(),
        asset.unit_price ?? asset.maintenance_cost
      ),
    };
    if (asset.category === 'machine') {
      machines.push({ ...item, description: asset.name, operators: 0 });
      continue;
    }
    // byCategory keeps every category as-saved (whatever readInversion found,
    // not just the 3 InputNovus happens to always have) - Fixed Assets
    // (Balance Sheet) reads this. The legacy transport/buildings/compute
    // buckets still get filled too, by pattern-matching back to them, for
    // the Cost Table/Operating Expenses pipeline that's hardcoded to those 3.
    (groupedAssets.byCategory[asset.category] ??= []).push(item);
    const legacyKey = legacyAssetKey(asset.category);
    if (legacyKey) groupedAssets[legacyKey].push(item);
  }

  const shares = Array.from({ length: 12 }, () => 0);
  for (const row of monthShares ?? []) {
    const index = Number(row.month) - 1;
    if (index >= 0 && index < 12) shares[index] = asNumber(row.percentage, 0);
  }
  const yearZeroTotal = asNumber(yearZeroDemand?.total, 0);
  const yearZeroOrders = shares.map((share) => yearZeroTotal * share);

  return {
    metadata: {
      name: game.name,
      source: 'novus-tables',
    },
    timeline: {
      years,
      startYear: years[0],
      endYear: years[years.length - 1],
      financingPeriods: asNumber(premises?.periods, 60),
    },
    premises: {
      fxClose: seriesFromYearly(years, premisesYearly, 'exchange_rate', premises?.exchange_rate),
      nationalLeadingRate: seriesFromYearly(
        years,
        premisesYearly,
        'national_leading_rate',
        premises?.national_leading_rate
      ),
      cpp: seriesFromYearly(years, premisesYearly, 'cpp', premises?.cpp),
      cetes: seriesFromYearly(years, premisesYearly, 'cetes', premises?.cetes),
      libor: seriesFromYearly(years, premisesYearly, 'libor', premises?.libor),
      nationalInflation: seriesFromYearly(
        years,
        premisesYearly,
        'national_inflation',
        premises?.national_inflation
      ),
      foreignInflation: seriesFromYearly(
        years,
        premisesYearly,
        'foreign_inflation',
        premises?.foreign_inflation
      ),
      isr: seriesFromYearly(years, premisesYearly, 'isr', premises?.isr),
      impac: seriesFromYearly(years, premisesYearly, 'impac', premises?.impac),
      ptu: seriesFromYearly(years, premisesYearly, 'ptu', premises?.ptu),
      inventoryPct: seriesFromYearly(
        years,
        premisesPercentageYearly,
        'inventary_percentage',
        premisesPercentage?.inventary_percentage
      ),
      suppliersPct: seriesFromYearly(
        years,
        premisesPercentageYearly,
        'provider_percentage',
        premisesPercentage?.provider_percentage
      ),
      shortTermLiabilityPct: seriesFromYearly(
        years,
        premisesPercentageYearly,
        'short_term_passive_percentage',
        premisesPercentage?.short_term_passive_percentage
      ),
      directProductCostPct: seriesFromYearly(
        years,
        premisesPercentageYearly,
        'product_direct_cost_percentage',
        premisesPercentage?.product_direct_cost_percentage
      ),
      indirectProductCostPct: seriesFromYearly(
        years,
        premisesPercentageYearly,
        'product_indirect_cost',
        premisesPercentage?.product_indirect_cost
      ),
      salesExpensePct: seriesFromYearly(
        years,
        premisesPercentageYearly,
        'sale_expenses',
        premisesPercentage?.sale_expenses
      ),
      adminPct: seriesFromYearly(
        years,
        premisesPercentageYearly,
        'administration_percentage',
        premisesPercentage?.administration_percentage
      ),
      depreciationBuildings: seriesFromYearly(
        years,
        premisesDeprecationsYearly,
        'building',
        premisesDeprecations?.building
      ),
      depreciationTransport: seriesFromYearly(
        years,
        premisesDeprecationsYearly,
        'transport',
        premisesDeprecations?.transport
      ),
      depreciationCompute: seriesFromYearly(
        years,
        premisesDeprecationsYearly,
        'compute',
        premisesDeprecations?.compute
      ),
      depreciationMachinery: seriesFromYearly(
        years,
        premisesDeprecationsYearly,
        'machinery',
        premisesDeprecations?.machinery
      ),
    },
    demand: {
      monthShares: shares,
      yearZeroOrders,
      yearZeroYear: asNumber(yearZeroDemand?.year),
      yearZeroTotal,
    },
    capacity: {
      line: {
        qualityYield: asNumber(capacity?.quality_yield),
        secondsPerUnit: asNumber(capacity?.seconds_x_unit ?? productionLine?.seconds_per_process),
        hoursShift: asNumber(capacity?.hours_shift),
        shifts: asNumber(capacity?.shifts),
        productionLines: 1,
        weekWorkingDays: asNumber(capacity?.week_working_days),
        monthsWorkingWeeks: 4,
        yearWorkingMonths: asNumber(capacity?.year_working_months),
      },
      machines,
    },
    bom: {
      productName: bom?.product_name ?? game.name,
      salePrice: asNumber(bom?.sale_price),
      parts: (bomParts ?? []).map((part) => ({
        id: part.material_code,
        description: part.material,
        quantity: asNumber(part.amount, 0),
        cost: asNumber(part.price, 0),
      })),
    },
    assets: groupedAssets,
    employees: mappedEmployees,
    services: (services ?? []).map((service) => ({
      category: service.category ?? '',
      subcategory: service.subcategory ?? '',
      description: service.description || service.name || '',
      monthlyAmount: asNumber(service.default_cost, 0),
    })),
  };
}
