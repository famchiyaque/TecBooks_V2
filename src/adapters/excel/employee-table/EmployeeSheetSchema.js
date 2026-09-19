import { normalizeCellText, isBlankCell } from './cellText.js';

const QUANTITY_HEADER = 'cantidad';

/**
 * Maps an "Empleados_2" header row (Nombre, Tipo, Percepcion, IMSS, ..., Salario
 * Integrado, Cantidad, ...) by name instead of fixed position, so adding/removing
 * a deduction column doesn't shift every other lookup.
 *
 * "Cantidad" is the right-hand boundary: every non-blank column to its left is
 * captured as an employee attribute, whatever that template calls them.
 */
export class EmployeeSheetSchema {
  constructor(headerRow) {
    this.headerRow = headerRow || [];
    this.columnsByName = this.#buildColumnIndex();
    this.quantityColumn = this.columnsByName.get(QUANTITY_HEADER);
    this.attributeColumns = this.#buildAttributeColumns();
  }

  #buildColumnIndex() {
    const columnsByName = new Map();
    this.headerRow.forEach((header, index) => {
      if (isBlankCell(header)) return;
      columnsByName.set(normalizeCellText(header), index);
    });
    return columnsByName;
  }

  #buildAttributeColumns() {
    if (this.quantityColumn === undefined) return [];

    const columns = [];
    for (let index = 0; index < this.quantityColumn; index += 1) {
      const header = this.headerRow[index];
      if (isBlankCell(header)) continue;
      columns.push({ name: String(header).trim(), index });
    }
    return columns;
  }

  columnIndex(headerName) {
    return this.columnsByName.get(normalizeCellText(headerName));
  }
}
