import computeActives from "@/sims/project-feasibility/balance/computeActives.js";

// currentActives/deferedActives are both row-keyed objects of year-maps
// (e.g. { cashAndBank: {2025: X, ...}, total: {...} }) - sum every row
// except the precomputed "total" (would double count).
function sumRowKeyedTotal(rowKeyedObject, year) {
  return Object.entries(rowKeyedObject || {}).reduce((sum, [key, yearMap]) => {
    if (key === "total") return sum;
    return sum + (yearMap?.[year] || 0);
  }, 0);
}

function computeTotalActives(project) {
  const years = project.timeline.years;
  const actives = computeActives(project);

  const total = years.reduce((acc, year) => {
    const currentTotal = sumRowKeyedTotal(actives.currentActives, year);
    const deferredTotal = sumRowKeyedTotal(actives.deferedActives, year);
    // fixedAssets (computeFixedAssetsTotal) is an array of
    // { year, grossValue, accumulatedDepreciation, netValue } - one entry
    // per year, not a row-keyed object like the other two.
    const fixedTotal = actives.fixedAssets?.find(
      (item) => String(item.year) === String(year),
    )?.netValue || 0;

    acc[year] = currentTotal + fixedTotal + deferredTotal;
    return acc;
  }, {});

  return total;
}

export default computeTotalActives;
