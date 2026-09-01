import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const DEFAULT_CONFIG = {
  showProgress: true,
  animate: true,
  overlayColor: '#03045e',
  overlayOpacity: 0.6,
  stagePadding: 6,
  stageRadius: 8,
  popoverClass: 'tecbooks-tour-popover',
  nextBtnText: 'Siguiente',
  prevBtnText: 'Atrás',
  doneBtnText: 'Listo',
  progressText: '{{current}} de {{total}}',
}

/**
 * Reusable guided-tour wrapper around driver.js. One instance per page:
 *
 *   export const programsPortalTour = new PageTour([
 *     { element: '#add-project-btn', popover: { title: 'Nuevo programa', description: 'Sube un Excel aquí.' } },
 *     { element: '#program-card-0', popover: { title: 'Tus programas', description: 'Click para ver sus proyectos.' } },
 *   ])
 *
 * Then drop a <TourButton tour={programsPortalTour} /> anywhere on that page.
 * `element` must match a real `id`/selector rendered on the page - steps for
 * elements that aren't mounted are skipped automatically (skipMissingElement).
 */
export class PageTour {
  constructor(steps, config = {}) {
    this.steps = steps
    this.config = { ...DEFAULT_CONFIG, skipMissingElement: true, ...config }
    this._driver = null
  }

  start(stepIndex) {
    this._driver = driver({ ...this.config, steps: this.steps })
    this._driver.drive(stepIndex)
  }

  destroy() {
    this._driver?.destroy()
    this._driver = null
  }
}
