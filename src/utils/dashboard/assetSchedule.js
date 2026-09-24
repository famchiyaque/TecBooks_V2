/**
 * Single source of truth for reading an asset's `{year: value}` acquisition
 * schedule (InputNovus/Template Financiero shape: buildings, transport,
 * compute, machinery - anything with an `acquisitionByYear` field).
 *
 * InputNovus repeats an asset's value flat across every year column
 * (Inversion!D2 = "=C2" - a display/book-value convention, not a new
 * purchase each year). Every consumer used to re-derive its own read logic
 * from that shape and got it wrong in a different way each time (RF-55/
 * RF-56/RF-63: accumulating the flat value across years in one place,
 * repeating it as a fresh cash outflow every year in another) - these are
 * the only two things anyone should ever need from acquisitionByYear, so
 * route every consumer through them instead of writing another one-off loop.
 */

/** The asset's value as of a given year - 0 if that year has no entry. */
export function assetValueInYear(asset, year) {
  return asset?.acquisitionByYear?.[year] || 0;
}

/** Sum of assetValueInYear across a list of assets, for one year. */
export function sumAssetsValueInYear(assets, year) {
  return (assets ?? []).reduce(
    (sum, asset) => sum + assetValueInYear(asset, year),
    0,
  );
}

/**
 * The year this asset was actually acquired - the first year (in `years`
 * order) with a non-zero value. Every later year just repeats the same
 * value (book value held constant), it is not a second purchase.
 * Returns null if the asset has no non-zero value in any given year.
 */
export function assetAcquisitionYear(asset, years) {
  return years.find((year) => assetValueInYear(asset, year) > 0) ?? null;
}

/** The one-time cost paid in the asset's acquisition year (0 if none). */
export function assetAcquisitionCost(asset, years) {
  const year = assetAcquisitionYear(asset, years);
  return year === null ? 0 : assetValueInYear(asset, year);
}

/** Sum of assetAcquisitionCost across a list of assets - total initial spend. */
export function sumAssetsAcquisitionCost(assets, years) {
  return (assets ?? []).reduce(
    (sum, asset) => sum + assetAcquisitionCost(asset, years),
    0,
  );
}

/**
 * Cash actually spent buying assets IN this specific year (Capex, for Cash
 * Flow's "Salidas") - only assets whose acquisition year is this year, not
 * every asset's book value repeated every year.
 */
export function assetsCapexInYear(assets, year, years) {
  return (assets ?? []).reduce((sum, asset) => (
    assetAcquisitionYear(asset, years) === year
      ? sum + assetValueInYear(asset, year)
      : sum
  ), 0);
}
