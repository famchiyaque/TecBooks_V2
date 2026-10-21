import { computeAssetDepreciation, computeCumulativeInvestment } from '@/utils/dashboard/costCalculations'
import { assetValueInYear } from '@/utils/dashboard/assetSchedule.js'
import { mapAssetsToYears, yearMapFromSeries } from '@/sims/project-feasibility/costTable/cbmToCostTableInputs'
import { Logger } from '../utils/logger.js'

const logger = new Logger('ComputeFixedAssets')

// Maps a category label back to its Premisas depreciation rate field, for
// the 3 categories InputNovus happens to always have. Matches BOTH the raw
// Spanish Excel label (a fresh parse, straight from readInversion) and the
// English label game-to-cbm.mapper.js re-derives after a save/reload
// round-trip (the games DB schema only stores these 3 fixed categories, not
// arbitrary ones, so it re-synthesizes byCategory with its own English
// names on read - those need to match here too). A category the Excel
// invents that matches neither has no rate to depreciate it with (no source
// field exists for that) - falls back to 0%, not a guess.
const KNOWN_RATE_FIELD_BY_MATCH = [
  { match: 'equipo de transporte', field: 'depreciationTransport' },
  { match: 'transport equipment', field: 'depreciationTransport' },
  { match: 'edificios', field: 'depreciationBuildings' },
  { match: 'buildings', field: 'depreciationBuildings' },
  { match: 'equipo de computo', field: 'depreciationCompute' },
  { match: 'computer equipment', field: 'depreciationCompute' },
  { match: 'maquinaria', field: 'depreciationMachinery' },
  { match: 'machinery', field: 'depreciationMachinery' },
]

function normalize(text) {
  return String(text ?? '').toLowerCase().replace(/[.]/g, '').trim()
}

const MACHINERY_CATEGORY_PATTERN = /maquinaria|machinery/
const MACHINERY_FALLBACK_LABEL = 'Machinery and Equipment'

/**
 * BUG FIX: some projects list machinery in Inversion (its own "Maquinaria y
 * equipo" category, preferred - avoids double-counting when Capacidad also
 * lists the same machines), others don't have it in Inversion at all and
 * ONLY have it in Capacidad (capacity.machines). Prefer Inversion's own
 * category if it exists; fall back to Capacidad's machine list only when
 * Inversion has none - never both (double-depreciation), never neither
 * (this bug: machinery silently missing from Fixed Assets entirely).
 */
function resolveMachineryAssets(cbm) {
  const byCategory = cbm.assets?.byCategory ?? {}
  const inversionKey = Object.keys(byCategory).find((category) => MACHINERY_CATEGORY_PATTERN.test(normalize(category)))
  if (inversionKey) return { label: inversionKey, assets: byCategory[inversionKey] }
  if (cbm.capacity?.machines?.length) return { label: MACHINERY_FALLBACK_LABEL, assets: cbm.capacity.machines }
  return null
}

function rateFieldForCategory(category) {
  const normalized = normalize(category)
  return KNOWN_RATE_FIELD_BY_MATCH.find((item) => normalized.includes(item.match))?.field ?? null
}

/**
 * Looks up a rate series in premises.depreciationByCategory by fuzzy name
 * match - used for BOTH an unrecognized category's own rate (e.g. a
 * "Porcentaje Depreciacion Animales" row) AND an individual item's own rate
 * (e.g. "Porcentaje Depreciacion Vaca") - same lookup, just called with a
 * different label each time.
 */
function genericRateSeries(cbm, label) {
  const depreciationByCategory = cbm.premises?.depreciationByCategory ?? {}
  const normalizedLabel = normalize(label)
  const matchKey = Object.keys(depreciationByCategory).find((key) => normalize(key) === normalizedLabel)
    ?? Object.keys(depreciationByCategory).find((key) => (
      normalizedLabel.includes(normalize(key)) || normalize(key).includes(normalizedLabel)
    ))
  return matchKey ? depreciationByCategory[matchKey] : null
}

/**
 * Rate series for one asset category, tried in order: its own fixed
 * depreciationX field (Buildings/Transport/Compute/Machinery), else a
 * generic Premisas row matching the category name itself (e.g. "Porcentaje
 * Depreciacion Animales" for a category called "Animales"). This is only
 * ever the FALLBACK for an item that has no rate of its own - see
 * rateSeriesForItem, which tries the item's own name first.
 */
function rateSeriesForCategory(cbm, category) {
  const rateField = rateFieldForCategory(category)
  return rateField ? cbm.premises?.[rateField] : genericRateSeries(cbm, category)
}

/**
 * Depreciation is really per-ITEM, not per-category: two items in the same
 * category (e.g. "Vaca" and "Cerdo" under "Animales") can each have their
 * own Premisas rate ("Porcentaje Depreciacion Vaca" / "... Cerdo"). Tries
 * the item's own name first, falls back to the category's rate (or 0%) only
 * if the item has none of its own.
 */
function rateSeriesForItem(cbm, category, itemName) {
  return genericRateSeries(cbm, itemName) ?? rateSeriesForCategory(cbm, category)
}

function computeItemCumulativeByYear(asset, years) {
  const cumulativeByYear = {}
  for (const year of years) {
    cumulativeByYear[year] = assetValueInYear(asset, year)
  }
  return cumulativeByYear
}

/**
 * Balance Sheet > Fixed Assets: gross value, accumulated depreciation and
 * net value for every asset category the Excel actually has - dynamic, not
 * limited to Buildings/Transport/Compute/Machinery (see readInversion's
 * structural category detection). Machinery is special-cased via
 * resolveMachineryAssets: Inversion's own category if the project has one,
 * else Capacidad's machine list (capacity.machines) - never both (double-
 * depreciation) and never neither (machinery silently missing from Fixed
 * Assets, since not every project's Inversion sheet lists it). Depreciation
 * is computed per INDIVIDUAL ITEM (each with its own rate, see
 * rateSeriesForItem) and summed up to the category total - not the
 * category's cumulative gross value depreciated at one shared rate, since
 * two items in the same category can depreciate differently.
 */
export function computeFixedAssetsByCategory(cbm, years) {
  const categories = { ...(cbm.assets?.byCategory ?? {}) }
  const machinery = resolveMachineryAssets(cbm)
  if (machinery) categories[machinery.label] = machinery.assets

  const result = {}
  for (const [category, rawAssets] of Object.entries(categories)) {
    const assets = mapAssetsToYears(rawAssets, years)

    const items = assets.map((asset) => {
      const rateSeries = rateSeriesForItem(cbm, category, asset.name)
      const rateByYear = rateSeries
        ? yearMapFromSeries(rateSeries, years)
        : Object.fromEntries(years.map((year) => [year, 0]))

      const cumulativeByYear = computeItemCumulativeByYear(asset, years)
      const annualDepreciationByYear = computeAssetDepreciation([asset], rateByYear, years)

      let itemAccumulated = 0
      const accumulatedDepreciationByYear = {}
      for (const year of years) {
        itemAccumulated += annualDepreciationByYear[year] || 0
        accumulatedDepreciationByYear[year] = itemAccumulated
      }

      return { name: asset.name, cumulativeByYear, annualDepreciationByYear, accumulatedDepreciationByYear }
    })

    const grossByYear = computeCumulativeInvestment([assets], years)

    let accumulatedDepreciation = 0
    const rows = years.map((year) => {
      const annualDepreciation = items.reduce((sum, item) => sum + (item.annualDepreciationByYear[year] || 0), 0)
      accumulatedDepreciation += annualDepreciation
      const grossValue = grossByYear[year] || 0
      return {
        year,
        grossValue,
        annualDepreciation,
        accumulatedDepreciation,
        netValue: grossValue - accumulatedDepreciation,
      }
    })

    result[category] = { rows, items }
  }
  logger.debug('computeFixedAssetsByCategory', { categories: Object.keys(result), result })
  return result
}

/**
 * Total Fixed Assets (Balance Sheet): sums gross/accumulated depreciation/net
 * across ALL categories found, however many there are.
 */
export function computeFixedAssetsTotal(byCategory, years) {
  const result = years.map((year) => {
    let grossValue = 0
    let accumulatedDepreciation = 0
    for (const { rows } of Object.values(byCategory)) {
      const row = rows.find((candidate) => candidate.year === year)
      grossValue += row?.grossValue || 0
      accumulatedDepreciation += row?.accumulatedDepreciation || 0
    }
    return { year, grossValue, accumulatedDepreciation, netValue: grossValue - accumulatedDepreciation }
  })
  logger.debug('computeFixedAssetsTotal', { years, result })
  return result
}
