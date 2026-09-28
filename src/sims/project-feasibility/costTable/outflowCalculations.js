import {
  cbmToOperatingExpenseInputs,
  mapAssetsToYears,
} from "./cbmToCostTableInputs";
import { assetsCapexInYear } from "@/utils/dashboard/assetSchedule.js";
import { Logger } from "../utils/logger.js";

const logger = new Logger("OutflowCalculations");

// Buildings/Transport/Compute keep their own named row (unchanged labels) -
// matched the same way computeFixedAssets.js matches them for depreciation,
// so both places agree on what counts as "Buildings" etc regardless of
// exact wording/language in the project's Inversion sheet.
const KNOWN_ASSET_CATEGORY_MATCH = [
  { match: "equipo de transporte", key: "transport" },
  { match: "transport equipment", key: "transport" },
  { match: "edificios", key: "buildings" },
  { match: "buildings", key: "buildings" },
  { match: "equipo de computo", key: "compute" },
  { match: "computer equipment", key: "compute" },
  { match: "maquinaria", key: "machinery" },
  { match: "machinery", key: "machinery" },
];

function normalizeCategoryName(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[.]/g, "")
    .trim();
}

function knownAssetKeyForCategory(category) {
  const normalized = normalizeCategoryName(category);
  return (
    KNOWN_ASSET_CATEGORY_MATCH.find((item) => normalized.includes(item.match))
      ?.key ?? null
  );
}

/**
 * BUG FIX: capex used to only ever look at Buildings/Transport/Compute/
 * Machinery - any category the project's Inversion sheet named something
 * else (e.g. "Animales") was silently never counted as a cash outflow.
 * These are whatever's left in assets.byCategory after removing the 3
 * known ones - each gets its own dynamic Cash Outflows row.
 */
export function getExtraAssetCategories(cbm) {
  const categories = cbm.assets?.byCategory ?? {};
  return Object.keys(categories).filter(
    (category) => !knownAssetKeyForCategory(category),
  );
}

/**
 * RF-63 BUG FIX: Cash Outflows ("Salidas", Flujo sheet rows 13-30). Reuses
 * the same fields the Income Statement rows (buildCostOfSales) already
 * computed for everything except asset purchases - those are a one-time
 * cash event at each asset's own acquisition year (assetsCapexInYear), not
 * InputNovus' repeated flat book value counted as a fresh purchase every
 * single year the asset is still listed.
 */
export function computeCapexByYear(cbm, years) {
  const opex = cbmToOperatingExpenseInputs(cbm, years);
  const categories = cbm.assets?.byCategory ?? {};
  const extraCategories = getExtraAssetCategories(cbm);
  const extraAssetsByCategory = Object.fromEntries(
    extraCategories.map((category) => [
      category,
      mapAssetsToYears(categories[category], years),
    ]),
  );

  const capexByYear = {};
  years.forEach((year) => {
    const extra = {};
    extraCategories.forEach((category) => {
      extra[category] = assetsCapexInYear(
        extraAssetsByCategory[category],
        year,
        years,
      );
    });
    capexByYear[year] = {
      machinery: assetsCapexInYear(opex.machines, year, years),
      buildings: assetsCapexInYear(opex.assets.buildings, year, years),
      compute: assetsCapexInYear(opex.assets.compute, year, years),
      transport: assetsCapexInYear(opex.assets.transport, year, years),
      extra,
    };
  });
  logger.debug("computeCapexByYear", { years, extraCategories, capexByYear });
  return capexByYear;
}

/**
 * Fixed rows plus one dynamic row per Inversion category that isn't one of
 * the known ones (Buildings/Transport/Compute/Machinery) - a function of
 * the project now, not a static list, since which extra categories exist
 * (if any) varies per project.
 *
 * Machinery has its own fixed row ("machineryPurchase") whose value comes
 * from computeFinancing (cbm.capacity.machines, one-time at year zero).
 * Maquinaria/Machinery patterns are in KNOWN_ASSET_CATEGORY_MATCH so that
 * a project whose Inversion sheet also has a "Maquinaria y equipo" category
 * does NOT spawn a second dynamic row that double-counts the same purchase.
 */
export function buildOutflowRows(cbm) {
  const extraRows = getExtraAssetCategories(cbm).map((category) => ({
    key: `extraAsset:${category}`,
    label: `${category} Purchase`,
  }));

  return [
    { key: "rawMaterial", label: "Raw Materials" },
    { key: "directLabour", label: "Direct Labor" },
    { key: "indirectManufacturing", label: "Indirect Manufacturing Salaries" },
    { key: "engineeringSalaries", label: "Engineering Salaries" },
    { key: "indirectMaterials", label: "Indirect Materials" },
    { key: "administrativeSalary", label: "Administrative Salaries" },
    { key: "administrativeGeneral", label: "General Administrative Expenses" },
    { key: "salesExpenses", label: "Sales Expenses" },
    { key: "buildingPurchase", label: "Building Construction/Purchase" },
    { key: "civilWorks", label: "Civil Works (Machinery Installation)" },
    { key: "computerEquipment", label: "Computer Equipment Purchase" },
    { key: "transportEquipment", label: "Transport Equipment Purchase" },
    { key: "machineryPurchase", label: "Machinery Purchase" },
    ...extraRows,
    { key: "creditPayment", label: "Credit Payment" },
    { key: "creditInterest", label: "Credit Interest" },
    { key: "taxes", label: "Taxes" },
    { key: "insurance", label: "Insurance" },
    { key: "otherExpenses", label: "Other Expenses" },
  ];
}

/** rowByYear: costOfSalesByYear keyed by year. capexByYear: computeCapexByYear's output. */
export function outflowBaseValue(rowKey, year, rowByYear, capexByYear) {
  const row = rowByYear[year];
  const capex = capexByYear[year] ?? {
    machinery: 0,
    buildings: 0,
    compute: 0,
    transport: 0,
    extra: {},
  };

  if (rowKey.startsWith("extraAsset:")) {
    return capex.extra?.[rowKey.slice("extraAsset:".length)] ?? 0;
  }

  switch (rowKey) {
    case "rawMaterial":
      return row?.rawMaterial ?? 0;
    case "directLabour":
      return row?.directLabour ?? 0;
    case "indirectManufacturing":
      return row?.indirectManufacturing ?? 0;
    case "engineeringSalaries":
      return row?.engineeringSalaries ?? 0;
    case "indirectMaterials":
      return row?.indirectMaterials ?? 0;
    case "administrativeSalary":
      return row?.administrativeSalary ?? 0;
    case "administrativeGeneral":
      return row?.administrativeExpenses;
    case "salesExpenses":
      return row?.salesExpenses ?? 0;
    case "machineryPurchase":
      return row?.machineryPurchase ?? 0;
    case "buildingPurchase":
      return capex.buildings;
    case "civilWorks":
      return row?.civilWorks;
    case "computerEquipment":
      return capex.compute;
    case "transportEquipment":
      return capex.transport;
    case "creditPayment":
      return row?.creditPayment ?? 0;
    case "creditInterest":
      return row?.financialExpenses ?? 0;
    case "taxes":
      return (row?.isr ?? 0) + (row?.ptu ?? 0);
    case "insurance":
      return 0;
    case "otherExpenses":
      return 0;
    default:
      return 0;
  }
}
