import * as XLSX from 'xlsx'
import { REQUIRED_SHEETS } from '../constants.js'
import { createProjectClass } from '../model/createProjectClass.js'
import { applyDerivedBase } from '../model/applyDerivedBase.js'
import { validateProjectClass } from '../model/validateProjectClass.js'
import { getFileGateError } from './fileGates.js'
import { Logger } from '../utils/logger.js'
import {
  readBOM,
  readCOs,
  readCapacidad,
  readEmpleados,
  readInversion,
  readPremisas,
  readServicios,
} from './sheets.js'

const logger = new Logger('ParseNovusProject')

function toRows(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName]
  if (!sheet) return []
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: undefined, raw: true })
}

function readWorkbook(input) {
  if (input && input.SheetNames && input.Sheets) return input
  if (input instanceof ArrayBuffer) {
    return XLSX.read(input, { type: 'array' })
  }
  if (input instanceof Uint8Array) {
    return XLSX.read(input, { type: 'array' })
  }
  throw new Error('Expected an ArrayBuffer or an xlsx workbook')
}

/**
 * Parse one Novus project workbook.
 * @param {ArrayBuffer | Uint8Array | object} input
 * @param {{ fileName?: string }} [options]
 */
export function parseNovusProject(input, { fileName } = {}) {
  logger.info('parsing workbook', { fileName })
  const workbook = readWorkbook(input)
  const missing = REQUIRED_SHEETS.filter((name) => !workbook.Sheets[name])
  if (missing.length) {
    logger.warn('workbook missing required sheets', { fileName, missing })
    return {
      project: null,
      validation: {
        valid: false,
        errors: missing.map((name) => `Missing sheet "${name}"`),
        warnings: [],
      },
    }
  }

  const project = createProjectClass({ fileName })
  readPremisas(toRows(workbook, 'Premisas'), project)
  readCOs(toRows(workbook, 'COs'), project)
  readCapacidad(toRows(workbook, 'Capacidad'), project)
  readBOM(toRows(workbook, 'BOM'), project)
  readInversion(toRows(workbook, 'Inversion'), project)
  readEmpleados(toRows(workbook, 'Empleados_2'), project)
  readServicios(toRows(workbook, 'Servicios'), project)

  project.metadata.name = project.bom.productName || ''
  applyDerivedBase(project)

  const validation = validateProjectClass(project)
  if (!validation.valid) {
    logger.warn('workbook parsed with validation errors', { fileName, errors: validation.errors })
  } else {
    logger.debug('workbook parsed OK', { fileName })
  }

  return { project, validation }
}

export async function parseNovusProjectFile(file) {
  const gate = getFileGateError(file)
  if (gate) {
    logger.warn('rejected file before parsing', { fileName: file?.name, reason: gate })
    return {
      project: null,
      validation: { valid: false, errors: [gate], warnings: [] },
    }
  }
  const buffer = await file.arrayBuffer()
  return parseNovusProject(buffer, { fileName: file.name })
}
