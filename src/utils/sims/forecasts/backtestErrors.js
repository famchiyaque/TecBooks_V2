// RF7/RF8 - Metricas de error para backtesting: comparan los puntos de
// prueba reales contra lo que CADA metodo elegido habria pronosticado para
// esos mismos puntos (error = actual - pronostico, para cualquier metodo -
// distinto de los residuales de regresion propia que usa Calculators.js
// del lado de Project Evaluation).

function errorsBetween(actual, predicted) {
  return actual
    .map((value, i) => [value, predicted[i]])
    .filter(([, p]) => p !== null && p !== undefined && Number.isFinite(p))
    .map(([value, p]) => value - p);
}

export function mad(actual, predicted) {
  const errors = errorsBetween(actual, predicted);
  if (!errors.length) return 0;
  return errors.reduce((sum, e) => sum + Math.abs(e), 0) / errors.length;
}

export function mse(actual, predicted) {
  const errors = errorsBetween(actual, predicted);
  if (!errors.length) return 0;
  return errors.reduce((sum, e) => sum + e * e, 0) / errors.length;
}

export function rmse(actual, predicted) {
  return Math.sqrt(mse(actual, predicted));
}

export function mape(actual, predicted) {
  const pairs = actual
    .map((value, i) => [value, predicted[i]])
    .filter(([value, p]) => value !== 0 && p !== null && p !== undefined && Number.isFinite(p));
  if (!pairs.length) return 0;
  return (
    (pairs.reduce((sum, [value, p]) => sum + Math.abs((value - p) / value), 0) / pairs.length) * 100
  );
}

export function mpe(actual, predicted) {
  const pairs = actual
    .map((value, i) => [value, predicted[i]])
    .filter(([value, p]) => value !== 0 && p !== null && p !== undefined && Number.isFinite(p));
  if (!pairs.length) return 0;
  return (
    (pairs.reduce((sum, [value, p]) => sum + (value - p) / value, 0) / pairs.length) * 100
  );
}

/** Las 5 metricas de RF7/8, para una tabla ya ordenada de menor a mayor error. */
export function computeBacktestErrors(actual, predicted) {
  return {
    mad: mad(actual, predicted),
    mse: mse(actual, predicted),
    rmse: rmse(actual, predicted),
    mape: mape(actual, predicted),
    mpe: mpe(actual, predicted),
  };
}
