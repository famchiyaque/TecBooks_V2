function computeDeferedActives(project) {
  const years = project.timeline.years;
  const defered = years.reduce((acc, year) => {
    acc[year] = {
      diferedActives: 0,
      insurance: 0,
      insurancePayments: 0,
    };
    return acc;
  }, {});

  return defered;
}

export default computeDeferedActives;
