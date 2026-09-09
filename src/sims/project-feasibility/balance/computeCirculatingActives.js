import computeFlow from "@/sims/project-feasibility/flow/computeFlow.js";

function computeCirculatingActives(project) {
  const years = project.timeline.years;
  const flow = computeFlow(project);
  // TODO: Inventary, pending accounts, deposits, stocks
  const inventary = mockFills(years);
  const deposits = mockFills(years);
  const stocks = mockFills(years);
  stocks[years[0]] = 2000000;

  const activesTotal = flow.reduce((acc, curr) => {
    acc[year] = curr + inventary[year] + deposits[year] + stocks[year];
    return acc;
  }, {});

  return { circulatingActives: activesTotal, flow, inventary, deposits, stocks };
}

export default computeCirculatingActives;
