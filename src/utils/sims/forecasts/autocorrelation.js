// RF3/RF4 - Autocorrelacion (correlograma clasico, bandas de confianza del
// 95% via el error estandar acumulado de Bartlett y el t-critico de la
// distribucion t-Student con df = n-1). Verificado contra un caso de prueba
// real (demanda mensual de 12 meses, r/SE/LIGA/LSGA de un calculo en Excel).

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

// t-critico a dos colas (alpha=0.05) por grados de libertad, tabla estandar
// (df = 1..30). Mas alla de df=30 se usa la aproximacion de muestra grande
// (z=1.96), que es a donde converge la t-Student de todas formas.
const T_TABLE_95 = [
  12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228,
  2.201, 2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08,
  2.074, 2.069, 2.064, 2.06, 2.056, 2.052, 2.048, 2.045, 2.042,
];

function tCritical95(df) {
  if (df <= 0) return T_TABLE_95[0];
  if (df > T_TABLE_95.length) return 1.96;
  return T_TABLE_95[df - 1];
}

/**
 * Error estandar de Bartlett para el lag k: asume ruido blanco mas alla de
 * los lags 1..k-1 ya observados.
 * SE_k = sqrt((1 + 2 * sum_{j=1}^{k-1} r_j^2) / n)
 */
function bartlettStandardError(n, priorAcfValues) {
  const sumSq = priorAcfValues.reduce((acc, r) => acc + r ** 2, 0);
  return Math.sqrt((1 + 2 * sumSq) / n);
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

  const n = series.length;
  const tCritical = tCritical95(n - 1);

  const rows = [];
  const priorAcfValues = [];
  for (let lag = 1; lag <= maxLag; lag += 1) {
    const acf = acfAt(series, lag);
    const se = bartlettStandardError(n, priorAcfValues);
    const liga = -tCritical * se;
    const lsga = tCritical * se;
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
    priorAcfValues.push(acf);
  }
  return rows;
}
