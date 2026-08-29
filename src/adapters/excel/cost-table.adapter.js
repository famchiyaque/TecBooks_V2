/**
 * Cost table (RF 50) Excel adapter.
 *
 * Reads the real "InputNovus" template (Premisas, COs, Capacidad, BOM, Empleados_2 sheets).
 * Values are kept raw (not coerced to numbers) wherever they feed into the cost table so
 * RF-00-01 can detect non-numeric input; sanitizing here would silently turn "abc" into 0.
 */

function classifyEmployee(name, tipo) {
  const upperName = String(name || '').toUpperCase();
  if (upperName.startsWith('MOD ')) return 'direct';
  if (upperName.startsWith('MOID ')) return 'indirect';
  if (upperName.startsWith('IM ') || upperName.includes('INGENIERO')) return 'engineering';
  if (tipo === 'administracion') return 'administrative';
  if (tipo === 'operacion') return 'indirect'; // supervision / operations overhead
  return null;
}

/**
 * "Empleados_2" sheet: header row 0 (Nombre, Tipo, Percepcion, ..., Salario Integrado),
 * one registered employee per data row.
 * The template has no headcount column, so quantity is fixed at 1 per registered row
 * (each row already represents one position); "Salario Integrado" (col 12) is the
 * fully-loaded monthly cost used for the MOD/MO indirecta/Ingenieria/Administracion sums.
 */
function extractEmployees(empleadosSheet) {
  const [, ...rows] = empleadosSheet;

  return rows
    .filter((row) => row && row[0])
    .map((row, index) => ({
      id: index,
      name: row[0],
      category: classifyEmployee(row[0], String(row[1] || '').trim().toLowerCase()),
      quantity: 1,
      monthlySalary: row[12],
    }));
}

/**
 * "Premisas" sheet: year header at row 1 (cols 1..11 = 2025..2035), "Porcentaje de costo
 * indirecto del producto." at row 23.
 */
function extractPremises(premisasSheet) {
  const yearsRow = premisasSheet[1] || [];
  const indirectRow = premisasSheet[23] || [];
  const indirectProductPercentage = {};

  for (let col = 1; col < yearsRow.length; col++) {
    const year = yearsRow[col];
    if (typeof year !== 'number') continue; // skip trailing note columns (e.g. "Campos editables")
    indirectProductPercentage[year] = indirectRow[col];
  }

  return { indirectProductPercentage };
}

/**
 * "COs" sheet: row 1, cols 7-8 hold the year-zero marker ("Año Cero" year + total purchase
 * orders for that year), e.g. year 2025, total 16000.
 * "Capacidad" sheet: row 1, col 1 = initial Quality yield.
 * "BOM" sheet: row 1 col 8 = "Costo de venta" (unit sales price), row 2 col 8 =
 * "Costo de Materia Prima" (unit raw material cost, MP).
 */
function extractProduction(cosSheet, capacidadSheet, bomSheet) {
  const yearZero = cosSheet?.[1]?.[7];
  const yearZeroTotal = cosSheet?.[1]?.[8];
  const qualityYieldInitial = capacidadSheet?.[1]?.[1];

  const purchaseOrders = {};
  const qualityYield = {};
  if (yearZero !== undefined && yearZero !== '') {
    purchaseOrders[yearZero] = yearZeroTotal;
    qualityYield[yearZero] = qualityYieldInitial;
  }

  return {
    yearZeroRecorded: yearZero !== undefined && yearZero !== '' &&
      typeof yearZeroTotal === 'number' && Number.isFinite(yearZeroTotal),
    purchaseOrders,
    qualityYield,
    materialCostPerUnit: bomSheet?.[2]?.[8],
    salesPricePerUnit: bomSheet?.[1]?.[8],
  };
}

/**
 * Adapts a raw workbook (from XLSX.utils.sheet_to_json with { header: 1 }) into the
 * shape consumed by the costTable Redux slice: { employees, production, premises }.
 */
export function adaptCostTableExcel(excelData) {
  return {
    employees: extractEmployees(excelData.Empleados_2 || []),
    production: extractProduction(excelData.COs || [], excelData.Capacidad || [], excelData.BOM || []),
    premises: extractPremises(excelData.Premisas || []),
  };
}
