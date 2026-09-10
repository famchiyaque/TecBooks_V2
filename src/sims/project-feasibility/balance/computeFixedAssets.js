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

function rateFieldForCategory(category) {
  if (category === MACHINERY_CATEGORY) return 'depreciationMachinery'
  const normalized = String(category ?? '').toLowerCase().trim()
  return KNOWN_RATE_FIELD_BY_MATCH.find((item) => normalized.startsWith(item.match))?.field ?? null
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
 * Inversion). Each category also lists its individual assets (name +
 * cumulative value per year) - what's actually driving that category's
 * depreciation number.
 */
export function computeFixedAssetsByCategory(cbm, years) {
  const categories = { ...(cbm.assets?.byCategory ?? {}) }
  if (cbm.capacity?.machines?.length) {
    categories[MACHINERY_CATEGORY] = cbm.capacity.machines
  }

  const result = {}
  for (const [category, rawAssets] of Object.entries(categories)) {
    const assets = mapAssetsToYears(rawAssets, years)
    const rateField = rateFieldForCategory(category)
    const rateByYear = rateField
      ? yearMapFromSeries(cbm.premises?.[rateField], years)
      : Object.fromEntries(years.map((year) => [year, 0]))

    const grossByYear = computeCumulativeInvestment([assets], years)
    const annualDepreciationByYear = computeAssetDepreciation(assets, rateByYear, years)

    let accumulatedDepreciation = 0
    const rows = years.map((year) => {
      accumulatedDepreciation += annualDepreciationByYear[year] || 0
      const grossValue = grossByYear[year] || 0
      return {
        year,
        grossValue,
        annualDepreciation: annualDepreciationByYear[year] || 0,
        accumulatedDepreciation,
        netValue: grossValue - accumulatedDepreciation,
      }
    })

    const items = assets.map((asset) => ({
      name: asset.name,
      cumulativeByYear: computeItemCumulativeByYear(asset, years),
    }))

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
