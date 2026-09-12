import computeActives from "@/sims/project-feasibility/balance/computeActives.js";
import flipObject from "@/utils/flipObject.js";

function computeTotalActives(project) {
  const years = project.timeline.years;

  const actives = computeActives(project);
  delete actives.fixedAssetsByCategory;
  delete actives.investment;

  actives.fixedAssets = flipObject(actives.fixedAssets);
  const total = years.reduce((acc, year) => {
    const currentTotal = Object.entries(actives.currentActives || {}).reduce(
      (sum, [key, yearMap]) => {
        if (key === "total") return sum;
        return sum + (yearMap?.[year] || 0);
      },
      0,
    );

    const fixedAssetEntry = Object.values(actives.fixedAssets || {}).find(
      (item) => String(item.year) === String(year),
    );
    const fixedTotal = fixedAssetEntry?.netValue || 0;

    const deferredTotal = sum(actives.deferedActives?.[year]);

    acc[year] = currentTotal + fixedTotal + deferredTotal;
    return acc;
  }, {});

  return total;
}

function sum(object) {
  if (!object || typeof object !== "object") return 0;
  return Object.values(object).reduce((acc, curr) => {
    return acc + (Number(curr) || 0);
  }, 0);
}

export default computeTotalActives;
