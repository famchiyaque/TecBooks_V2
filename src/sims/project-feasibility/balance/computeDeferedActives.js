// Balance > Activo Diferido = Seguros + Pago de Seguros (Template Financiero
// rows 24-25). Neither has a source field anywhere in InputNovus (confirmed -
// no "seguro" row in any sheet) - same situation as RF-56's Financial Income:
// base 0, manual/overridable via the Current Actives-style editable table,
// not a guess. The reference template itself keeps both at 0 for a typical
// project, so this isn't a simplification - it matches real usage.
function computeDeferedActives(project) {
  const years = project.timeline.years;
  const seguros = zeroFills(years);
  const pagoSeguros = zeroFills(years);

  const total = years.reduce((acc, year) => {
    acc[year] = seguros[year] + pagoSeguros[year];
    return acc;
  }, {});

  return { seguros, pagoSeguros, total };
}

function zeroFills(years) {
  return years.reduce((acc, year) => {
    acc[year] = 0;
    return acc;
  }, {});
}

export default computeDeferedActives;
