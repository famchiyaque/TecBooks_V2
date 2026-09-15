import computeAmortizationInterest from "@/sims/project-feasibility/income/computeAmortizationInterest";
import computeInvestment from "@/sims/project-feasibility/income/computeInvestment";

function computePassives(project) {
  const years = project.timeline.years;

  const { total } = computeInvestment(project);
  const { yearAmortization, yearInterest } = computeAmortizationInterest(
    total,
    project,
  );

  // Long term passives
  const longTermPassives = years.reduce((acc, year, idx) => {
    const pending = total - yearAmortization[idx] * (idx + 1);

    if (pending >= 0)
      acc[year] = {
        currentCapital: pending,
        interestsPayment: yearInterest[idx],
      };
    else
      acc[year] = {
        currentCapital: null,
        interestsPayment: null,
      };
    return acc;
  }, {});

  // Current Passives (Documentos por pagar / Proveedores) has no source
  // field anywhere in InputNovus - confirmed, only two policy premises exist
  // ("Porcentaje de proveedores" 20%, "Porcentaje de pasivo corto plazo" 3%)
  // and neither the reference Template Financiero nor any formula in it
  // actually uses them (searched all 12 sheets - zero references). The
  // template itself just types in placeholder pesos (450000/0 at year zero,
  // dropping to an unexplained 45000 from year 1 on) with no business logic
  // behind them. Same situation as Activo Diferido (computeDeferedActives):
  // base empty, manual/overridable via the Current Passives editable table.
  const currentPassives = years.reduce((acc, year) => {
    acc[year] = {};
    return acc;
  }, {});

  const totalPassives = Object.entries(longTermPassives).reduce(
    (acc, [year, object]) => {
      acc[year] =
        Object.values(object).reduce((a, c) => a + c, 0) +
        Object.values(currentPassives[year]).reduce((a, c) => a + c, 0);
      return acc;
    },
    {},
  );

  return { longTermPassives, currentPassives, totalPassives };
}

export default computePassives;
