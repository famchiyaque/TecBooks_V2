/**
 * Suma la adquisición de activos para un año específico
 */
function computeCapexForYear(opx, yearStr) {
  let capexTotal = 0;

  // 1. Sumar Maquinaria
  if (Array.isArray(opx.machines)) {
    opx.machines.forEach((item) => {
      capexTotal += item.acquisitionByYear?.[yearStr] || 0;
    });
  }

  // 2. Sumar Activos (Edificios, Transporte, Cómputo)
  if (opx.assets) {
    Object.values(opx.assets).forEach((assetList) => {
      if (Array.isArray(assetList)) {
        assetList.forEach((item) => {
          capexTotal += item.acquisitionByYear?.[yearStr] || 0;
        });
      }
    });
  }

  return capexTotal;
}

/**
 * Calcula los totales anuales de Egresos de Efectivo combinando costOfSales y opx
 */
export function getAnnualCashOutflowsTotal(costOfSales, opx) {
  const outflowsByYear = {};

  costOfSales.costOfSalesByYear.forEach((row) => {
    const yearStr = String(row.year);

    // 1. Costo Directo e Indirecto de Operación
    const operatingCashOutflow =
      (row.rawMaterial || 0) +
      (row.directLabour || 0) +
      (row.indirectManufacturing || 0) +
      (row.engineeringSalaries || 0) +
      (row.indirectMaterials || 0) +
      (row.administrativeSalary || 0) +
      (row.administrativeExpenses || 0) +
      (row.salesExpenses || 0);

    // 2. Adquisición Directa de Activos / Inversiones en efectivo (CAPEX)
    const capexOutflow = computeCapexForYear(opx, yearStr);

    // 3. Pagos de Financiamiento e Impuestos
    const financialOutflow =
      (row.creditPayment || 0) +
      (row.financialExpenses || 0) +
      (row.isr > 0 ? row.isr : 0) + // Solo se restan impuestos si son mayores a 0 (si es pérdida fiscal, no hay salida de dinero)
      (row.ptu > 0 ? row.ptu : 0);

    // TOTAL EGRESOS DE EFECTIVO
    outflowsByYear[yearStr] =
      operatingCashOutflow + capexOutflow + financialOutflow;
  });

  return outflowsByYear;
}
