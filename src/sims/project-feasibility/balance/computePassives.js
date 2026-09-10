const DOCUMENTS = 450000;
const PROVIDER = 0;

function computePassives(project) {
  const years = project.timeline.years;

  const longTermPassives = 0;
  const currentPassives = years.reduce((acc, curr) => {
    acc[curr] = {
      documents: DOCUMENTS,
      provider: PROVIDER,
    };
    return acc;
  }, {});

  return { longTermPassives, currentPassives };
}

export default computePassives;
