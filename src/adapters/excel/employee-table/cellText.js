const COMBINING_DIACRITICS = /[̀-ͯ]/g;

/**
 * Accent/case-insensitive text compare for Excel header cells
 * ("Percepción" vs "Percepcion", "CANTIDAD" vs "Cantidad", etc).
 */
export function normalizeCellText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS, '')
    .trim()
    .toLowerCase();
}

export function isBlankCell(value) {
  return value === undefined || value === null || String(value).trim() === '';
}
