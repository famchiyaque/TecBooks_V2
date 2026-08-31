export const HORIZON_START_YEAR = 2025
export const HORIZON_END_YEAR = 2035
export const HORIZON_YEARS = Array.from(
  { length: HORIZON_END_YEAR - HORIZON_START_YEAR + 1 },
  (_, i) => HORIZON_START_YEAR + i
)
export const HORIZON_LENGTH = HORIZON_YEARS.length

export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export const REQUIRED_SHEETS = [
  'Premisas',
  'COs',
  'Capacidad',
  'BOM',
  'Inversion',
  'Empleados_2',
  'Servicios',
]

export const IGNORED_SHEETS = ['Empleados']

export const MAX_FILE_BYTES = 5 * 1024 * 1024
export const MAX_PROJECTS_PER_PROGRAM = 10
export const ALLOWED_EXTENSIONS = ['.xlsx', '.xls']

export const SKIP_SERVICES_SUBCATEGORY = /sueldos y salarios/i
