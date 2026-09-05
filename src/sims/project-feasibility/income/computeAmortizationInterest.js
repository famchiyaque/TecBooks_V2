/**
 * Calcula el esquema mensual y anual de amortizaciones e intereses para una inversión.
 *
 * @param {number} totalInvestment - Monto total del capital invertido.
 * @param {number} periods - Número total de periodos (meses).
 * @param {number[]} interestRate - Arreglo de tasas de interés anuales por año [año1, año2, ...].
 *
 * @returns {{
 *   amortization: number,
 *   interest: number[],
 *   yearAmortization: number[],
 *   yearInterest: number[]
 * }} Objeto con la cuota de amortización fija, el desglose mensual de intereses y sus agregados anuales.
 */
export default function computeAmortizationInterest(totalInvestment, project) {
  const periods = project.timeline.financingPeriods;
  const interestRate = project.premises.nationalLeadingRate;

  const years = Math.floor(periods / 12);

  const amortization = totalInvestment / periods;
  const interest = new Array(periods).fill(0).map((_, idx) => {
    // const year = Math.floor(idx / years);
    const year = 0;
    const interest = (interestRate[year] / 12) * totalInvestment;
    totalInvestment -= amortization;
    return interest;
  });

  const yearAmortization = computeAmortization(amortization, periods);
  const yearInterest = computeInterest(interest, periods);

  return { amortization, interest, yearAmortization, yearInterest };
}

/**
 * Agrupa la amortización fija mensual en un arreglo con los totales acumulados por año.
 *
 * @param {number} amortization - Monto fijo de amortización mensual.
 * @param {number} periods - Número total de periodos (meses).
 *
 * @returns {number[]} Arreglo donde cada elemento representa la amortización total del año.
 *   Ejemplo: [12000, 12000, 4000] para 28 meses con $1,000/mes.
 */
function computeAmortization(amortization, periods) {
  const years = Math.floor(periods / 12);
  const remainder = periods - years * 12;
  const yearAmortization = new Array(years)
    .fill(0)
    .map((_) => amortization * 12);

  if (remainder > 0) {
    yearAmortization.push(amortization * remainder);
  }

  return yearAmortization;
}

/**
 * Suma los intereses mensuales agrupándolos por año.
 *
 * @param {number[]} interest - Arreglo con el interés calculado para cada mes.
 * @param {number} periods - Número total de periodos (meses).
 *
 * @returns {number[]} Arreglo con la suma total de intereses correspondiente a cada año.
 */
function computeInterest(interest, periods) {
  const years = Math.floor(periods / 12);
  const remainder = periods - years * 12;
  const yearInterest = new Array(years)
    .fill(0)
    .map((_, idx) =>
      interest.slice(idx * 12, 12 * (idx + 1)).reduce((a, c) => a + c, 0),
    );

  if (remainder > 0) {
    yearInterest.push(amortization * remainder);
  }

  return yearInterest;
}
