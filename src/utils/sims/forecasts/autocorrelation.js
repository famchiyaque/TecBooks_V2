// RF3/RF4 - Autocorrelacion (correlograma clasico, bandas de confianza del
// 95% via la aproximacion de muestra grande 1/sqrt(n) para el error estandar -
// datos de prueba para el prototipo, alguien mas hace la implementacion real
// contra el backend).

/**
 * Coeficiente de autocorrelacion (Pearson) de una serie consigo misma,
 * desfasada `lag` periodos: r_k = Cov(y_t, y_t+k) / Var(y).
 */
export function acfAt(series, lag) {
  const n = series.length;
  if (lag <= 0 || lag >= n) return 0;

  const mean = series.reduce((a, b) => a + b, 0) / n;
  let numerator = 0;
  for (let t = 0; t < n - lag; t += 1) {
    numerator += (series[t] - mean) * (series[t + lag] - mean);
  }
  let denominator = 0;
  for (let t = 0; t < n; t += 1) {
    denominator += (series[t] - mean) ** 2;
  }
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Error estandar de muestra grande para el correlograma: SE = 1/sqrt(n).
 * Mismo valor para todos los lags (aproximacion estandar de libro de texto,
 * no la formula de Bartlett acumulada).
 */
export function standardError(series) {
  const n = series.length;
  return n > 0 ? 1 / Math.sqrt(n) : 0;
}

/**
 * Tabla de autocorrelacion (RF3): un renglon por lag, 1..maxLag.
 * maxLag: 6-12 segun RF3 ("6 o 12 renglones, si hay 1-2 anios de datos
 * historicos") - el caller decide cuantos lags pedir, aqui solo se calculan.
 *
 * @param {number[]} series - serie plana (ej. demanda mensual concatenada)
 * @param {number} maxLag
 * @returns {{lag:number, se:number, t:number, liga:number, lsga:number, acf:number, significant:boolean}[]}
 */
export function buildAutocorrelationTable(series, maxLag) {
  if (!Array.isArray(series) || series.length < 2) return [];

  const se = standardError(series);
  const liga = -1.96 * se;
  const lsga = 1.96 * se;

  const rows = [];
  for (let lag = 1; lag <= maxLag; lag += 1) {
    const acf = acfAt(series, lag);
    const t = se === 0 ? 0 : acf / se;
    rows.push({
      lag,
      se,
      t,
      liga,
      lsga,
      acf,
      // RF3: verde si ACF > LSGA o ACF < LIGA (fuera de la banda de confianza).
      significant: acf > lsga || acf < liga,
    });
  }
  return rows;
}
