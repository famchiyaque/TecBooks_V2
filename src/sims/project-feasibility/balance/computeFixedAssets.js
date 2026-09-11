import { computeAssetDepreciation, computeCumulativeInvestment } from '@/utils/dashboard/costCalculations'
import { mapAssetsToYears, yearMapFromSeries } from '@/sims/project-feasibility/costTable/cbmToCostTableInputs'

// This exact label is our own (English UI, see FixedAssetsTable) - matched by
// identity, not pattern, so translating it never breaks its rate lookup.
const MACHINERY_CATEGORY = 'Machinery and Equipment'

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
]

function normalize(text) {
  return String(text ?? '').toLowerCase().replace(/[.]/g, '').trim()
}

function rateFieldForCategory(category) {
  if (category === MACHINERY_CATEGORY) return 'depreciationMachinery'
  const normalized = normalize(category)
  return KNOWN_RATE_FIELD_BY_MATCH.find((item) => normalized.startsWith(item.match))?.field ?? null
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
  let cumulative = 0
  for (const year of years) {
    cumulative += asset.acquisitionByYear[year] || 0
    cumulativeByYear[year] = cumulative
  }
  return cumulativeByYear
}

/**
 * Balance Sheet > Fixed Assets: gross value, accumulated depreciation and
 * net value for every asset category the Excel actually has - dynamic, not
 * limited to Buildings/Transport/Compute (see readInversion's structural
 * category detection) - plus Machinery and Equipment (Capacidad, not
 * Inversion). Depreciation is computed per INDIVIDUAL ITEM (each with its
 * own rate, see rateSeriesForItem) and summed up to the category total -
 * not the category's cumulative gross value depreciated at one shared rate,
 * since two items in the same category can depreciate differently.
 */
export function computeFixedAssetsByCategory(cbm, years) {
  const categories = { ...(cbm.assets?.byCategory ?? {}) }
  if (cbm.capacity?.machines?.length) {
    categories[MACHINERY_CATEGORY] = cbm.capacity.machines
  }

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
  return result
}

/**
 * Total Fixed Assets (Balance Sheet): sums gross/accumulated depreciation/net
 * across ALL categories found, however many there are.
 */
export function computeFixedAssetsTotal(byCategory, years) {
  return years.map((year) => {
    let grossValue = 0
    let accumulatedDepreciation = 0
    for (const { rows } of Object.values(byCategory)) {
      const row = rows.find((candidate) => candidate.year === year)
      grossValue += row?.grossValue || 0
      accumulatedDepreciation += row?.accumulatedDepreciation || 0
    }
    return { year, grossValue, accumulatedDepreciation, netValue: grossValue - accumulatedDepreciation }
  })
}
