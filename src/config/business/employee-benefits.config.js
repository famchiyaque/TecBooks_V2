/**
 * Employee Benefits Based On Country
 *
 * This is the single source of truth for employee benefits.
 * The business model will use the country from metadata to determine the benefits of employees.
 */

/**
 * Employee benefits objects for different countries
 * @returns {Object}
 */
export const laborBenefits = {
  mexico: {
    imss: 0,
    infonavit: 0,
    valesDespensa: 0,
    primaVacacional: 0,
    aguinaldo: 0,
    fondoAhorro: 0,
    comedor: 0,
    isr: 0,
  },
  usa: {
    medicare: 0,
    socialSecurity: 0,
    unemploymentInsurance: 0,
    disabilityInsurance: 0,
    paidTimeOff: 0,
    paidHoliday: 0,
    paidVacation: 0,
    paidSickLeave: 0,
  },
}
