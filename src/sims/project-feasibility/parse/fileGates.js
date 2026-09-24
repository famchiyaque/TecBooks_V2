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
  if (!file) return 'No file'
  const ext = extensionOf(file.name)
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return 'Only .xlsx or .xls files are allowed'
  }
  if (typeof file.size === 'number' && file.size > MAX_FILE_BYTES) {
    return 'File exceeds 5MB'
  }
  return null
}

export function getProgramFileCountError(files) {
  const count = files?.length ?? 0
  if (count < 1) return 'Select at least one project'
  if (count > MAX_PROJECTS_PER_PROGRAM) {
    return `Maximum ${MAX_PROJECTS_PER_PROGRAM} projects per program`
  }
  return null
}
