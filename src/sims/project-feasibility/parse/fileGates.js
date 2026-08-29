import {
  ALLOWED_EXTENSIONS,
  MAX_FILE_BYTES,
  MAX_PROJECTS_PER_PROGRAM,
} from '../constants.js'

function extensionOf(fileName) {
  const name = fileName ?? ''
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot).toLowerCase() : ''
}

export function getFileGateError(file) {
  if (!file) return 'No hay archivo'
  const ext = extensionOf(file.name)
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return 'Solo se permiten archivos .xlsx o .xls'
  }
  if (typeof file.size === 'number' && file.size > MAX_FILE_BYTES) {
    return 'El archivo supera 5MB'
  }
  return null
}

export function getProgramFileCountError(files) {
  const count = files?.length ?? 0
  if (count < 1) return 'Selecciona al menos un proyecto'
  if (count > MAX_PROJECTS_PER_PROGRAM) {
    return `Máximo ${MAX_PROJECTS_PER_PROGRAM} proyectos por programa`
  }
  return null
}
