export async function getPrices(c) {
  const { projectId, programId } = c.req.params();
  const prices = await getPricesUseCase(c.env, programId, projectId);
  return c.json(prices);
}
