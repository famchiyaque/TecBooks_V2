import { isBlankCell } from './cellText.js';
import { EmployeeSheetSchema } from './EmployeeSheetSchema.js';
import { Employee } from './Employee.js';

/**
 * Reads the "Empleados_2" sheet: header row 0, one employee per data row,
 * columns resolved by name via EmployeeSheetSchema instead of fixed indices.
 */
export class EmployeeTableReader {
  constructor(sheetRows) {
    this.sheetRows = sheetRows || [];
  }

  read() {
    const [headerRow, ...dataRows] = this.sheetRows;
    const schema = new EmployeeSheetSchema(headerRow || []);
    const nameColumn = schema.columnIndex('Nombre');

    return dataRows
      .filter((row) => row && nameColumn !== undefined && !isBlankCell(row[nameColumn]))
      .map((row) => new Employee(row, schema));
  }
}
