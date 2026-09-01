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
  nextBtnText: 'Next',
  prevBtnText: 'Previous',
  doneBtnText: 'Done',
  progressText: '{{current}} of {{total}}',
}

/**
 * Reusable guided-tour wrapper around driver.js. One instance per page:
 *
 *   export const programsPortalTour = new PageTour([
 *     { element: '#add-project-btn', popover: { title: 'New program', description: 'Upload an Excel file here.' } },
 *     { element: '#program-card-0', popover: { title: 'Your programs', description: 'Click to see its projects.' } },
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
