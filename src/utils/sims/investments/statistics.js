// ---------- Helpers ----------
function getRegression(cashflow) {
  const n = cashflow.length;
  const x = cashflow.map((_, i) => i + 1);
  const y = cashflow;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, xi, i) => a + xi * y[i], 0);
  const sumX2 = x.reduce((a, xi) => a + xi * xi, 0);
  const sumY2 = y.reduce((a, yi) => a + yi * yi, 0);

  const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const a = (sumY - b * sumX) / n;

  return { n, x, y, sumX, sumY, sumXY, sumX2, sumY2, a, b };
}

// Errores: real - pronóstico
function getErrors(cashflow) {
  const { y, x, a, b } = getRegression(cashflow);
  return y.map((yi, i) => yi - (a + b * x[i]));
}

// ---------- Estadísticas ----------

// Coeficiente de correlación (Pearson) entre el periodo y las ventas
export function getR(cashflow) {
  const { n, sumX, sumY, sumXY, sumX2, sumY2 } = getRegression(cashflow);
  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));
  return den === 0 ? 0 : num / den;
}

// Error estándar de estimación: sqrt(SSE / (n - 2))
export function getSE(cashflow) {
  const n = cashflow.length;
  if (n <= 2) return 0;
  const sse = getErrors(cashflow).reduce((acc, e) => acc + e * e, 0);
  return Math.sqrt(sse / (n - 2));
}

// Valor t de la correlación: r * sqrt(n - 2) / sqrt(1 - r²)
export function getTValue(cashflow) {
  const n = cashflow.length;
  const r = getR(cashflow);
  if (n <= 2 || Math.abs(r) === 1) return Infinity;
  return (r * Math.sqrt(n - 2)) / Math.sqrt(1 - r * r);
}

// Grados de libertad ajustados (n - 2), usados para buscar el t crítico
export function getAdjustedLag(cashflow) {
  return Math.max(cashflow.length - 2, 0);
}

// Desviación absoluta media: Σ|e| / n
export function getMAD(cashflow) {
  const e = getErrors(cashflow);
  return e.reduce((acc, ei) => acc + Math.abs(ei), 0) / e.length;
}

// Error cuadrático medio: Σe² / n
export function getMSE(cashflow) {
  const e = getErrors(cashflow);
  return e.reduce((acc, ei) => acc + ei * ei, 0) / e.length;
}

// Raíz del error cuadrático medio
export function getRMSE(cashflow) {
  return Math.sqrt(getMSE(cashflow));
}

// Error porcentual absoluto medio (%): Σ(|e| / |y|) / n * 100
export function getMAPE(cashflow) {
  const e = getErrors(cashflow);
  const valid = e
    .map((ei, i) => [ei, cashflow[i]])
    .filter(([, yi]) => yi !== 0);
  if (!valid.length) return 0;
  return (
    (valid.reduce((acc, [ei, yi]) => acc + Math.abs(ei / yi), 0) /
      valid.length) *
    100
  );
}

// Error porcentual medio (%): Σ(e / y) / n * 100  (indica sesgo)
export function getMPE(cashflow) {
  const e = getErrors(cashflow);
  const valid = e
    .map((ei, i) => [ei, cashflow[i]])
    .filter(([, yi]) => yi !== 0);
  if (!valid.length) return 0;
  return (
    (valid.reduce((acc, [ei, yi]) => acc + ei / yi, 0) / valid.length) * 100
  );
}
