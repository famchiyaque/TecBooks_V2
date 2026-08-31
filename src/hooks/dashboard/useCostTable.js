import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectFileName, selectEmployees, selectProduction, selectPremises,
  selectHasFile, selectHasYearZeroRecord, selectHasEmployees, selectAllEmployeesHaveQuantity,
} from '@/store/costTable.store';
import {
  areCostsNumeric, sumSalariesByCategory, computeNetSales, computeRawMaterialCost,
  computeIndirectMaterialCosts, buildCostOfSalesTable, findUnclassifiedEmployees,
} from '@/utils/dashboard/costCalculations';

/**
 * Runs the RF 50 validations against the costTable Redux slice and, once they all
 * pass, consolidates MP + MOD + MO indirecta + Ingenieria + Administracion + Materiales
 * indirectos into the per-year cost-of-sales table. Calculations run entirely on the
 * frontend; nothing here calls a backend endpoint.
 */
export default function useCostTable() {
  const fileName = useSelector(selectFileName);
  const hasFile = useSelector(selectHasFile);
  const employees = useSelector(selectEmployees);
  const production = useSelector(selectProduction);
  const premises = useSelector(selectPremises);
  const hasYearZeroRecord = useSelector(selectHasYearZeroRecord);
  const hasEmployees = useSelector(selectHasEmployees);
  const allEmployeesHaveQuantity = useSelector(selectAllEmployeesHaveQuantity);

  return useMemo(() => {
    if (!hasFile) return { isValid: false, status: 'idle' };

    // RF-00-01: costs must be numeric values
    if (!areCostsNumeric(employees, production)) {
      return { isValid: false, status: 'error', error: 'Tipos de datos incorrectos' };
    }

    // RF-00-05: year zero record must exist
    if (!hasYearZeroRecord) {
      return { isValid: false, status: 'staging', fileName };
    }

    // RF-00-04: there must be registered employees
    if (!hasEmployees) {
      return { isValid: false, status: 'no-employees' };
    }

    // RF-00-02: every registered employee must have a quantity
    if (!allEmployeesHaveQuantity) {
      return {
        isValid: false,
        status: 'error',
        error: 'Empleados registrados no tienen su cantidad de empleados registrada',
      };
    }

    const years = Object.keys(production.purchaseOrders).map(Number);

    // RF-00-06: quantity, purchase orders, quality yield and POs after year zero must all be present
    const hasCompleteProductionData = years.some((year) => (
      (production.purchaseOrders[year] ?? 0) > 0 && (production.qualityYield[year] ?? 0) > 0
    ));
    if (!hasCompleteProductionData) {
      return { isValid: false, status: 'rejected', error: 'Proyecto invalido, intenta otro archivo' };
    }

    const { MOD, MOIndirecta, Ingenieria, Administracion } = sumSalariesByCategory(employees);
    const MP = computeRawMaterialCost(production);
    const netSales = computeNetSales(production);
    const indirectMaterials = computeIndirectMaterialCosts(premises, netSales);
    const costOfSalesByYear = buildCostOfSalesTable(years, {
      MP, MOD, MOIndirecta, Ingenieria, Administracion, indirectMaterials,
    });
    const unclassifiedEmployees = findUnclassifiedEmployees(employees);

    return { isValid: true, status: 'ready', costOfSalesByYear, unclassifiedEmployees };
  }, [
    hasFile, fileName, employees, production, premises,
    hasYearZeroRecord, hasEmployees, allEmployeesHaveQuantity,
  ]);
}
