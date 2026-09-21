import { z } from 'zod';

// One entry per EditableTableSlice instance (src/store/costTable.store.js,
// src/store/balance.store.js) - keep in sync when a new editable table ships.
export const TABLE_ROW_VALUE_TYPES = [
  'cost_table',
  'operating_expenses',
  'financial_result',
  'taxes',
  'cash_inflows',
  'cash_outflows',
  'current_actives',
  'defered_actives',
  'current_passives',
  'long_term_passives',
  'equity',
];

export const tableRowValueTypeSchema = z.enum(TABLE_ROW_VALUE_TYPES);

const rowValueSchema = z.object({
  rowKey: z.string().trim().min(1),
  label: z.string().trim().nullable().optional(),
  isCustom: z.boolean().optional().default(false),
  year: z.number().int(),
  value: z.number(),
});

export const replaceTableRowValuesRequestSchema = z.object({
  rows: z.array(rowValueSchema),
});
