export function errorHandler(err, c) {
  const status = err.status ?? 500;
  if (status === 500) console.error(err);
  return c.json({ error: err.message ?? 'Internal error' }, status);
}
