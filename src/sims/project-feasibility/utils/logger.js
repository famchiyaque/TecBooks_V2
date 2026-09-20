const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 }
const STORAGE_KEY = 'tecbooks:feasibility:logLevel'
const HISTORY_LIMIT = 200

const history = []

function safeLocalStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

function resolveLevel() {
  const storage = safeLocalStorage()
  const stored = storage?.getItem(STORAGE_KEY)
  if (stored && LEVELS[stored] !== undefined) return stored
  return import.meta.env.DEV ? 'debug' : 'warn'
}

function record(entry) {
  history.push(entry)
  if (history.length > HISTORY_LIMIT) history.shift()
}

/**
 * Scoped logger for the Evaluador de Proyectos (project-feasibility) module.
 *
 * Every entry is kept in an in-memory ring buffer regardless of the active
 * level, so a bug report from production can still be reconstructed via
 * `Logger.getHistory()` even if nothing was printed to the console at the
 * time. Verbosity is controlled per-browser (not per-deploy): it defaults to
 * `debug` locally and `warn` in production, but can be raised on demand from
 * the devtools console with `Logger.enableVerbose()` — no redeploy needed.
 *
 * @example
 * const logger = new Logger('ProgramsApi')
 * logger.info('creating program', { name })
 * logger.error('createProgramRequest failed', error)
 */
export class Logger {
  /** @param {string} scope short, stable tag identifying the operation/module (e.g. "ProgramsApi") */
  constructor(scope) {
    this.scope = scope
  }

  debug(message, ...args) {
    this._log('debug', message, args)
  }

  info(message, ...args) {
    this._log('info', message, args)
  }

  warn(message, ...args) {
    this._log('warn', message, args)
  }

  error(message, ...args) {
    this._log('error', message, args)
  }

  /**
   * Wraps a timed operation, logging its duration and outcome.
   * @example
   * const result = await logger.time('parseNovusProject', () => parseNovusProject(buffer))
   */
  async time(label, fn) {
    const start = performance.now()
    try {
      const result = await fn()
      this.info(`${label} done`, { durationMs: Math.round(performance.now() - start) })
      return result
    } catch (error) {
      this.error(`${label} failed`, { durationMs: Math.round(performance.now() - start), error })
      throw error
    }
  }

  _log(level, message, args) {
    const entry = {
      timestamp: new Date().toISOString(),
      scope: this.scope,
      level,
      message,
      args,
    }
    record(entry)

    if (LEVELS[level] < LEVELS[resolveLevel()]) return

    const prefix = `[${entry.timestamp}] [${this.scope}] [${level.toUpperCase()}]`
    const method = level === 'debug' ? 'log' : level
    // console[method](prefix, message, ...args)
  }

  /** Full in-memory log history (all scopes, all levels), oldest first. */
  static getHistory() {
    return [...history]
  }

  static clearHistory() {
    history.length = 0
  }

  /** Raises this browser's log level to "debug", persisted in localStorage. Run from devtools in production to see everything. */
  static enableVerbose() {
    safeLocalStorage()?.setItem(STORAGE_KEY, 'debug')
  }

  /** Restores the default log level (debug in dev, warn in production). */
  static resetLevel() {
    safeLocalStorage()?.removeItem(STORAGE_KEY)
  }

  /** Current effective level for this browser ("debug" | "info" | "warn" | "error"). */
  static getLevel() {
    return resolveLevel()
  }
}

// Exposed on window so it's reachable from devtools in production, where
// there is no console access to this module's scope otherwise. Run
// `TecbooksLogger.enableVerbose()` in the console, reproduce the issue, then
// `TecbooksLogger.getHistory()` to see every calculation step recorded so far.
if (typeof window !== 'undefined') {
  window.TecbooksLogger = Logger
}
