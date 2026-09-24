import { normalizeCellText } from './cellText.js';

const NAME_HEADER = 'nombre';
const TYPE_HEADER = 'tipo';
const FULLY_LOADED_SALARY_HEADER = 'salario integrado';
const ENGINEERING_EXACT_NAMES = ['GERENTE DE OPERACIONES'];

/**
 * One "Empleados_2" data row, read through its EmployeeSheetSchema so column
 * order/count can vary between templates without breaking anything.
 *
 * Category mirrors the CATEGORY_TO_KEY map in costCalculations.js (direct ->
 * directLabour, indirect -> indirectManufacturing, engineering ->
 * engineeringSalaries, administrative -> administrativeExpenses).
 */
export class Employee {
  constructor(row, schema) {
    this.row = row;
    this.schema = schema;
  }

  #cell(headerName) {
    const index = this.schema.columnIndex(headerName);
    return index === undefined ? undefined : this.row[index];
  }

  get name() {
    return this.#cell(NAME_HEADER);
  }

  get quantity() {
    return this.schema.quantityColumn === undefined ? undefined : this.row[this.schema.quantityColumn];
  }

  get monthlySalary() {
    return this.#cell(FULLY_LOADED_SALARY_HEADER);
  }

  /** Every column left of "Cantidad", keyed by its own header text. */
  get attributes() {
    const values = {};
    for (const { name, index } of this.schema.attributeColumns) {
      values[name] = this.row[index];
    }
    return values;
  }

  get category() {
    const upperName = normalizeCellText(this.name).toUpperCase();
    if (upperName.startsWith('MOD ')) return 'direct';
    if (upperName.startsWith('MOID ')) return 'indirect';
    if (upperName.startsWith('IM ') || upperName.includes('INGENIERO')) return 'engineering';
    if (ENGINEERING_EXACT_NAMES.includes(upperName)) return 'engineering';

    const type = normalizeCellText(this.#cell(TYPE_HEADER));
    if (type === 'administracion') return 'administrative';
    if (type === 'operacion') return 'indirect'; // supervision / operations overhead
    return null;
  }

  toEmployee(id) {
    return {
      id,
      name: this.name,
      category: this.category,
      quantity: this.quantity,
      monthlySalary: this.monthlySalary,
      attributes: this.attributes,
    };
  }
}
